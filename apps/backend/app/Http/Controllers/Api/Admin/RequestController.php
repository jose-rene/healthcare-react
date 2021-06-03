<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assessment\AssessmentRequest;
use App\Http\Resources\RequestResource;
use App\Models\Request as Requests;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class RequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $data = Requests::search()->paginate($request->get('perPage', 50));

        return RequestResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AssessmentRequest $request
     * @return RequestResource
     */
    public function store(AssessmentRequest $request)
    {
        $data = Requests::create($request->validated());

        return new RequestResource($data);
    }

    /**
     * Display the specified resource.
     *
     * @param Requests $requests
     * @return RequestResource
     */
    public function show(Requests $requests)
    {
        return new RequestResource($requests);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AssessmentRequest $request
     * @param Requests          $requests
     * @return RequestResource
     */
    public function update(AssessmentRequest $request, Requests $requests)
    {
        $requests->update($request->validated());

        return new RequestResource($requests);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Requests $requests
     * @return Response
     */
    public function destroy(Requests $requests)
    {
        $requests->delete();

        return response()->noContent();
    }
}
