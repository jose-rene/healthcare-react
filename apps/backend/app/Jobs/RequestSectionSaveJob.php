<?php

namespace App\Jobs;

use App\Models\Request;
use Carbon\Carbon;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Exceptions\HttpResponseException;
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
        $request   = $this->request;
        $section   = $this->section;
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

            case 'category':
                $this->categorySection();
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
        $request           = $this->request;
        $relevantDiagnosis = request()->input('relevantDiagnosis');

        $trackedCodes = $request->relevantDiagnoses->keyBy('code')->map(function ($c) {
            return false;
        })->toArray();

        foreach ($relevantDiagnosis as $item) {
            $request->relevantDiagnoses()->updateOrCreate(['code' => $item['code']], [
                'code'        => $item['code'],
                'description' => $item['description'],
                'weighted'    => true,
            ]);
            $trackedCodes[$item['code']] = true;
        }

        $noLongerTracked = array_filter($trackedCodes, function ($c) {
            return $c === false;
        });

        // remove items that were removed from the form
        if (count($noLongerTracked) > 0) {
            $ids = array_keys($noLongerTracked);
            $request->relevantDiagnoses()->whereIn('id', $ids)->delete();
        }
    }

    protected function authNumberSection()
    {
        $request = $this->request;
        try {
            $this->request->update(request()->validate([
                'auth_number' => Rule::unique('requests')->where(fn($query) => $query->where('payer_id',
                    $request->payer_id)),
            ]));
        } catch (ValidationException $e) {
            throw new HttpResponseException(response()->json(['errors' => 'The Auth ID provided is not unique.'], 422));
        }
    }

    protected function dueSection()
    {
        $this->request->update(request()->validate([
            'due_at' => ['date', 'after:today'],
            'notes'  => [],// form - due_date + time
        ]));
    }

    protected function verify()
    {
        $request = $this->request;
        $member  = $request->member;

        $addressForm     = request()->input('address', []);
        $memberForm      = request()->only('member_number', 'line_of_business', 'dob');
        $memberPhoneForm = request()->only('phone');

        request()->validate([
            'dob'                 => 'date',
            'phone'               => '',
            'member_id'           => '',
            'address.address_1'   => '',
            'address.address_2'   => '',
            'address.city'        => '',
            'address.county'      => '',
            'address.state'       => '',
            'address.postal_code' => '',
            'address.is_primary'  => 'boolean',
        ]);

        if ($addressForm) {
            // only update the values that are passed in
            $member->addresses()->first()->update($addressForm);
        }

        if ($memberPhoneForm) {
            $member->phones()->firstOrCreate(['number' => $memberPhoneForm['phone']]);
        }

        if ($memberForm) {
            $member->update($memberForm);
        }

        $request->update(['member_verified_at' => Carbon::now()]);
    }

    protected function categorySection()
    {
    }
}
