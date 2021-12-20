<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClassificationResource;
use App\Models\Classification;
use Illuminate\Http\Request;

class ClassificationController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = Classification::paginate($request->get('perPage', 50));

        return ClassificationResource::collect($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  Classification  $classification
     * @return JsonResponse
     */
    public function show(Classification $classification)
    {
        return new ClassificationResource($classification);
    }
}
