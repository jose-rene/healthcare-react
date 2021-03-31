<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequestItemResource;
use App\Jobs\RequestSectionSaveJob;
use App\Models\Request as ModelRequest;
use App\Models\RequestItem;
use App\Models\RequestType;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RequestRequestItemController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @param ModelRequest $memberRequest
     * @return AnonymousResourceCollection
     */
    public function index(ModelRequest $memberRequest)
    {
        return RequestItemResource::collection($memberRequest->requestItems);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ModelRequest $memberRequest
     * @param Request      $request
     * @return RequestItemResource
     */
    public function store(ModelRequest $memberRequest, Request $request)
    {
        $data = $request->validate([
            'type_name' => 'required',
        ]);

        $request_type = RequestType::firstOrCreate(['name' => $data['type_name']]);

        $data['request_id']      = $memberRequest->id;
        $data['request_type_id'] = $request_type->id;

        $requestItem = $memberRequest->requestItems()->create($data);

        return new RequestItemResource($requestItem);
    }

    /**
     * Display the specified resource.
     *
     * @param ModelRequest $memberRequest
     * @param RequestItem  $requestItem
     * @return RequestItemResource
     */
    public function show(ModelRequest $memberRequest, RequestItem $requestItem)
    {
        return new RequestItemResource($requestItem);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ModelRequest $memberRequest
     * @param Request      $request
     * @param RequestItem  $requestItem
     * @return RequestItemResource
     */
    public function update(ModelRequest $memberRequest, Request $request, RequestItem $requestItem)
    {
        dispatch(new RequestSectionSaveJob($memberRequest, $request->all()));

        return new RequestItemResource($requestItem);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ModelRequest $memberRequest
     * @param RequestItem  $requestItem
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(ModelRequest $memberRequest, RequestItem $requestItem)
    {
        $requestItem->delete();

        return response()->json(['message' => 'ok']);
    }
}
