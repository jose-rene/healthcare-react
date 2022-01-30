<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConsiderationRequest;
use App\Http\Resources\RequestAssessmentResource;
use App\Jobs\RequestSectionSaveJob;
use App\Jobs\SubmitAssessmentJob;
use App\Models\Consideration;
use App\Models\Request as ModelRequest;
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
        $considerations = collect($data['considerations']);
        $default = $considerations->firstWhere('is_default', true);
        // update the default consideration
        Consideration::find($default['id'])->update([
            'is_recommended' => $default['is_recommended'],
        ]);
        // get the associated request item
        $requestItem = $request->requestItems->firstWhere('uuid', $default['request_item']);
        // the added consideration, are not default
        $added = $considerations->filter(fn($item) => empty($item['is_default']));
        // sync
        $updated = [];
        // update or remove any considerations that are not present in data
        $requestItem->considerations
            ->filter(fn($item) => empty($item['is_default']))
            ->each(function ($item, $key) use ($added, &$updated) {
            if (null !== ($found = $added->firstWhere('id', $item->id))) {
                $update = $item->update([
                    'request_type_id' => $found['request_type_id'],
                ]);
                $updated[] = $item->id;
            }
            else {
                // not present, delete
                $item->delete();
            }
        });
        // add any considerations not updated
        $added
            ->filter(fn($item) => empty($item['id']) || !in_array($item['id'], $updated))
            ->each(function ($item) use ($requestItem) {
                $requestItem->considerations()->create([
                    'request_type_id'   => $item['request_type_id'],
                ]);
            });

        if (!$requestItem->clinician_summary || $data['summary'] !== $requestItem->clinician_summary) {
            $requestItem->update(['clinician_summary' => $data['summary']]);
        }

        return response()->json(['message' => 'ok']);
    }

    /**
     * Order the media positions.
     *
     * @param Request $request
     * @return array
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

    /**
     * Store the diagnosis.
     *
     * @param Request $request
     * @return array
     */
    public function diagnosis(ModelRequest $request, Request $httpRequest)
    {
        dispatch(new RequestSectionSaveJob($request, $httpRequest->all()));

        return response()->json(['message' => 'ok']);
    }

    /**
     * Submit the assessment.
     *
     * @param Request $request
     * @return array
     */
    public function submit(ModelRequest $request)
    {
        dispatch(new SubmitAssessmentJob($request));

        return response()->json(['message' => 'ok']);
    }
}
