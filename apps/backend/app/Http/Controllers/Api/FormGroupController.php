<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\FormGroupSaveRequest;
use App\Http\Resources\Api\FormGroupResource;
use App\Http\Resources\FormGroupShowResource;
use App\Models\FormGroup;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = FormGroup::paginate($request->get('perPage', 50));
        return FormGroupResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(FormGroupSaveRequest $request)
    {
        $formGroup = FormGroup::create($request->validated());

        return response()->json(compact('formGroup'));
    }

    /**
     * Display the specified resource.
     *
     * @param FormGroup $formGroup
     * @return JsonResponse
     */
    public function show(FormGroup $formGroup)
    {
        return new FormGroupShowResource($formGroup);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request   $request
     * @param FormGroup $formGroup
     * @return JsonResponse
     */
    public function update(FormGroupSaveRequest $request, FormGroup $formGroup)
    {
        $data = $request->only(['name']);
        $formGroup->update($data);

        $formGroup->formsSlugSync($request->get('slugs', []));

        return response()->json(['message' => 'ok']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param FormGroup $formGroup
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(FormGroup $formGroup)
    {
        $formGroup->delete();

        return response()->json(['message' => 'ok']);
    }
}
