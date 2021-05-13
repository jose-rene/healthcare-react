<?php

namespace App\Jobs;

use App\Http\Requests\MemberRequest;
use App\Models\Request;
use App\Models\RequestItem;
use App\Models\RequestTypeDetail;
use Carbon\Carbon;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class RequestSectionSaveJob
{
    use Dispatchable;

    /**
     * @var Request
     */
    private Request $request;
    private array $section;

    /**
     * Create a new job instance.
     *
     * @param Request $request
     * @param array   $section
     */
    public function __construct(Request $request, array $section)
    {
        $this->request = $request;
        $this->section = $section;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $request = $this->request;
        $section = $this->section;

        if (empty($section['type_name'])) {
            throw new HttpResponseException(response()->json(['errors' => 'Action was not specified.'], 422));
        }

        $type_name = Str::slug($section['type_name']);

        switch ($type_name) {
            case 'verify':
                $this->verify();
                break;

            case 'diagnosis':
                // Syncs what the frontend sends to the related diagnosis. This could create,
                // update, or delete what is in the database
                $this->relevantDiagnosisSection();
                break;

            case 'auth-id':
                // basically updates the auth_number value in the request table
                $this->authNumberSection();
                break;

            case 'request-items':
                $this->requestItemsSection();
                break;

            case 'due':
                // update request.due_at or the note on the request item named due
                $this->dueSection();
                break;
        }

        if (request('is_last', false) === true) {
            // if this is the last section mark the request as received.
            $request->update([
                'request_status_id' => Request::$received,
            ]);
        }
    }

    protected function relevantDiagnosisSection()
    {
        // the codes are saved by position, otherwise they'll keep stacking
        $request = $this->request;
        $inputCodes = array_filter(request()->input('codes'), fn ($item) => !empty($item['code']));

        // check if there are more codes that what was posted
        if ($request->relevantDiagnoses->count() > ($count = count($inputCodes))) {
            // remove the ones that are no longer tracked
            $request->relevantDiagnoses()
                ->whereIn('id', $request->relevantDiagnoses->slice($count)->map(fn ($item) => $item['id'])->values()->all())
                ->delete();
        }

        // insert or update the rest
        $currentCodes = $request->relevantDiagnoses->toArray();
        foreach ($inputCodes as $i => $item) {
            // check if it's already there
            if (!empty($currentCodes[$i])) {
                // either update or do nothing
                if ($currentCodes[$i]['code'] !== $item['code']) {
                    $request->relevantDiagnoses()->find($currentCodes[$i]['id'])->update($item);
                }
                continue;
            }
            // create a new one
            $request->relevantDiagnoses()->create($item);
        }
        $request->refresh();
    }

    protected function authNumberSection()
    {
        $request = $this->request;
        try {
            $this->request->update(request()->validate([
                'auth_number' => Rule::unique('requests')->where(fn ($query) => $query->where([
                    ['payer_id', '=', $request->payer_id],
                    ['id', '<>', $request->id],
                ])
                ),
            ]));
        } catch (ValidationException $e) {
            throw new HttpResponseException(response()->json(['errors' => 'The Auth ID provided is not unique.'], 422));
        }
    }

    protected function dueSection()
    {
        if ('' === request()->input('due_at')) {
            // set date to null
            $this->request->update([
                'due_at' => null,
            ]);

            return;
        }
        // update date if valid
        $this->request->update(request()->validate([
            'due_at' => ['date', 'after:today'],
            'notes'  => [], // form - due_date + time
        ]));
    }

    /**
     * Verify and save changed information.
     *
     * @todo user the member Job for this
     *
     * @return void
     */
    protected function verify()
    {
        $request = $this->request;
        $member = $request->member;

        $addressForm = request()->input('address', []);
        $memberForm = request()->only('member_number', 'line_of_business', 'plan', 'phone');

        if ($addressForm) {
            $memberForm += $addressForm;
        }

        if ($memberForm) {
            $this->updateMember($memberForm, $member);
        }

        $request->update(['member_verified_at' => Carbon::now()]);
    }

    protected function requestItemsSection()
    {
        $rules = [
            'request_type_details'     => ['bail', 'required', 'array', 'min:1'],
            'request_type_details.*'   => ['bail', 'required', 'array', 'min:1'],
            'request_type_details.*.*' => ['bail', 'integer', 'exists:request_type_details,id'],
        ];
        $validator = Validator::make($params = request()->all(), $rules, [
            'required' => 'A valid request item is required.',
            'exists'   => 'An invalid request item was entered',
        ]);
        if ($validator->fails()) {
            throw new HttpResponseException(response()->json(['errors' => $validator->errors()->first()], 422));

            return;
        }
        $requestTypes = [];
        $requestTypeDetails = [];
        // each group of request type details will have a common request type
        foreach (request()->input('request_type_details') as $details) {
            // get the request type id from the first element
            $type = RequestTypeDetail::firstWhere('id', $details[0])->requestType;
            // add to stack
            $requestTypes[] = $type;
            // key the request type details by request type id for later reference
            $requestTypeDetails[$type['id']] = $details;
        }
        // dd($requestTypes);
        // see if the request item exists, add id
        $requestTypes = collect($requestTypes)->map(fn ($item) => [
            'id' => ($first = RequestItem::firstWhere([
                'request_id'      => $this->request->id,
                'request_type_id' => $item['id'],
            ])) ? $first->id : null,
            'request_id'      => $this->request->id,
            'request_type_id' => $item['id'],
            'name'            => $item['name'],
        ]);
        // sync request items
        $this->request
            ->requestItems()
            ->sync($requestTypes->toArray());
        // refresh to reload relationships
        $this->request->refresh();
        // sync the associated request type details for each request item
        $this->request->requestItems
            ->each(fn ($detail) => $detail->requestTypeDetails()->sync($requestTypeDetails[$detail['request_type_id']]));
        $this->request->refresh();
    }

    protected function updateMember($data, $member)
    {
        // use the member form request for validation
        $memberRequest = new MemberRequest();
        $validator = Validator::make(
            $data,
            $memberRequest->rules(),
            $memberRequest->messages()
        );
        // validate
        if ($validator->fails()) {
            throw new HttpResponseException(response()->json(['errors' => $validator->errors()->first()], 422));

            return;
        }
        // call member update job
        dispatch(new MemberUpdateJob($data, $member));
        $this->request->refresh();
    }
}
