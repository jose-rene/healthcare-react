<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assessment\AssessmentRequest;
use App\Http\Resources\RequestResource;
use App\Jobs\RequestSectionSaveJob;
use App\Models\Request as ModelRequest;
use App\Models\User;
use Exception;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request as Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
