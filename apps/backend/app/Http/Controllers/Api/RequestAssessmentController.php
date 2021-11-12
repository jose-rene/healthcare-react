<?php

namespace App\Http\Controllers\Api;

use App\Models\Request as ModelRequest;
use App\Http\Controllers\Controller;
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
}
