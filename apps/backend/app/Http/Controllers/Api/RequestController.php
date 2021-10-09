<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assessment\AssessmentRequest;
use App\Http\Resources\RequestResource;
use App\Jobs\RequestSectionSaveJob;
use App\Models\Request as ModelRequest;
use App\Models\RequestStatus;
use App\Models\User;
use Exception;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request as Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class RequestController extends Controller
{
    public function requestsItemsFunction()
    {
        /**
         * on page load Jarek will need this.
         */
        // value from request -> request_items

        // wheelchair (request_types)

        // wheel types, etc, etc NEW table ( request_type_detail )
        // request_type_detail[request_type_id] FK

        $request_types = [
            'name' => 'wheelchair',

            'request_type_details' => [
                'name' => 'leg rest',
            ],
        ];

        /*
         * on form save
         */
        /*
         * request = {
         * request_items = [
         *     {
         *         request_type_id,
         *        ...other field,
         *        request_item_details = [ {request_item_id, request_type_id} ] } ];
         * }
         */
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $data = ModelRequest::search($user)->paginate($request->get('perPage', 50));

        return RequestResource::collection($data);
    }

    public function summary()
    {
        /** @var User $user */
        $user = auth()->user();
        // @todo this needs to be updated for other user types
        $baseQuery = $user->healthPlanUser->requests();

        $assigned = (clone $baseQuery)->where('request_status_id', ModelRequest::$assigned)->count();
        $scheduled = (clone $baseQuery)->where('request_status_id', ModelRequest::$scheduled)->count();
        $submitted = (clone $baseQuery)->where('request_status_id', ModelRequest::$submitted)->count();
        $new = (clone $baseQuery)
            ->whereIn('request_status_id', [
                ModelRequest::$received,
                ModelRequest::$reopened,
            ])
            ->count();

        $summary = compact('new', 'assigned', 'scheduled', 'submitted');

        return response()->json($summary);
    }

    public function inspire()
    {
        return response()->json(['message' => Inspiring::quote()]);
    }

    public function list()
    {
        return response()->json([]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AssessmentRequest $request
     * @deprecated for member request create
     * @return RequestResource
     */
    public function store(AssessmentRequest $request)
    {
        abort(404);
        /** @var User $user */
        $user = auth()->user();
        // the request needs the payer-id, we can pull that from the logged in users healthPlanUser record
        $payer_id = $user->healthPlanUser->payer_id;
        // the user that created the request
        $payer_user_id = $user->id;

        $data = ModelRequest::create($request->validated() + compact(['payer_id', 'payer_user_id']));

        return new RequestResource($data);
    }

    /**
     * Display the specified resource.
     *
     * @param ModelRequest $request
     * @return RequestResource
     */
    public function show(ModelRequest $request)
    {
        return new RequestResource($request);
    }

    /**
     * Assign clinician to a request.
     *
     * @param Request $request
     * @return RequestResource
     */
    public function assign(ModelRequest $request, Request $httpRequest)
    {
        $user = auth()->user();
        if (!$user->can('assign-clinicians')) {
            throw new AuthorizationException('You are not authoized to assign clinicians.');
        }
        if (null === ($id = $httpRequest->input('clinician_id')) || null === ($therapist = User::firstWhere('uuid', $id))) {
            throw new HttpResponseException(response()->json(['errors' => ['therapist_id' => ['Invalid Therapist']]], 422));
        }
        $request->clinician()->associate($therapist);

        if (null !== ($id = $httpRequest->input('reviewer_id')) && null !== ($reviewer = User::firstWhere('uuid', $id))) {
            $request->reviewer()->associate($reviewer);
        }

        // @todo, there may need to be further logic for cancelled cases, etc
        if ($request->status_id === 1) {
            // change from submitted to assigned
            $request->requestStatus()->associate(RequestStatus::find(2));
        }

        $request->save();

        return response()->json(['status' => 'ok', 'clinician' => ['id' => $therapist->id]]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ModelRequest $request
     * @param Request      $httpRequest
     * @return RequestResource
     */
    public function update(ModelRequest $request, Request $httpRequest)
    {
        dispatch(new RequestSectionSaveJob($request, $httpRequest->all()));

        return new RequestResource($request);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ModelRequest $request
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(ModelRequest $request)
    {
        $request->delete();

        return response()->json(['message' => 'ok']);
    }
}
