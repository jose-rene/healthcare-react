<?php

namespace App\Http\Controllers\Api;

use App\Models\Request as ModelRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\ConsiderationRequest;
use App\Http\Resources\RequestAssessmentResource;
use Illuminate\Http\Request;

class RequestAssessmentController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param ModelRequest $request
     * @return RequestResource
     */
    public function show(ModelRequest $request)
    {
        return new RequestAssessmentResource($request);
    }

    /**
     * Store the considerations.
     *
     * @param Request $request
     * @return RequestResource
     */
    public function consideration(ModelRequest $request, ConsiderationRequest $formRequest)
    {
        $data = $formRequest->validated();

        return response()->json(['message' => 'ok']);
    }

    /**
     * Order the media positions.
     *
     * @param Request $request
     * @return RequestResource
     */
    public function media(ModelRequest $request, Request $httpRequest)
    {
        $params = $httpRequest->collect()->each(function($item) use ($request) {
            if (null !== ($document = $request->documents()->firstWhere('uuid', $item['id']))) {
                $document->update(['position' => $item['position']]);
            }
        });

        return response()->json(['message' => 'ok']);
    }
}
