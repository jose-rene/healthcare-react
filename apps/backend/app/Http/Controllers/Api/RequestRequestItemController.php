<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequestItemResource;
use App\Http\Resources\RequestRequestItemResource;
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
        return RequestRequestItemResource::collection($memberRequest->requestItems);
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
        $request_items = $request->input('request.request_items', []);

        // no items passed through they must have been removed
        if (empty($request_items)) {
            $memberRequest->requestItems()->delete();

            return response()->json([]);
        }

        foreach ($request_items as $request_item) {
            $request_type_id = RequestType::where('uuid', $request_item['id'])->first()->id ?? 0;
            $newRequestItem  = $memberRequest->requestItems()->create([
                'name'            => $request_item['name'],
                'request_type_id' => $request_type_id,
            ]);


            $request_item_details = $request_item['request_item_details'] ?? [];
            foreach ($request_item_details as $request_item_detail) {
                $newRequestItem->itemDetails()->create([
                    'name'            => $request_item_detail,
                    'request_type_id' => $request_type_id,
                ]);
            }
        }

        return response()->json(['status' => true, 'message' => 'ok']);
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
