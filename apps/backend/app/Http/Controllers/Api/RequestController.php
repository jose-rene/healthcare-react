<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assessment\AssessmentRequest;
use App\Http\Resources\RequestResource;
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
         * on page load Jarek will need this
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


        /**
         * on form save
         */
        /**
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
        $data = ModelRequest::search()->paginate($request->get('perPage', 50));

        return RequestResource::collection($data);
    }

    public function summary()
    {
        /** @var User $user */
//        $user      = auth()->user();
//        $baseQuery = $user->request();
        $baseQuery = ModelRequest::query();

        $summary = [
            'new'         => $baseQuery->where('request_status_id', 1)->orWhereNull('request_status_id')->count(),
            'in_progress' => $baseQuery->where('request_status_id', 2)->count(),
            'scheduled'   => $baseQuery->where('request_status_id', 3)->count(),
            'submitted'   => $baseQuery->where('request_status_id', 5)->count(),
        ];

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
     * @return RequestResource
     */
    public function store(AssessmentRequest $request)
    {
        $data = ModelRequest::create($request->validated());

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
        $data = $httpRequest->update($request->validated());

        return new RequestResource($data);
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
