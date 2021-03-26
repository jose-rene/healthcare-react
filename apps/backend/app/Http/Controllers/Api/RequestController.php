<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assessment\AssessmentRequest;
use App\Http\Resources\RequestResource;
use App\Models\Request as ModelRequest;
use Exception;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request as Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Str;

class RequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $data = ModelRequest::search()->pagination($request->get('perPage', 50));

        return RequestResource::collection($data);
    }

    public function summary()
    {
        $summary = [];

        // TODO :: add stats calculations
        $summary['new']         = rand(1, 50);
        $summary['in_progress'] = rand(1, 50);
        $summary['scheduled']   = rand(1, 50);
        $summary['submitted']   = rand(1, 50);

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
