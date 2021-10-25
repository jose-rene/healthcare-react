<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Http\Resources\Form\FormListResource;
use App\Models\Form;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormController extends Controller
{
    public function index(Request $request)
    {
        $forms = Form::paginate($request->get('perPage', 50));

        return FormListResource::collection($forms);
    }

    /**
     * Display the specified resource.
     *
     * @param Form $form
     * @return JsonResponse
     */
    public function show(Form $form)
    {
        return new FormResource($form);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Form    $form
     * @return JsonResponse
     */
    public function update(Request $request, Form $form)
    {
        $fields = $request->get('form', []);
        $form->update(compact('fields'));

        return response()->noContent();
    }

    public function store(Request $request)
    {
        // if copyFrom is present then its required
        $request->validate([
            'copyFrom' => ['required', 'sometimes'],
        ]);

        $fields = [];

        // get fields to copy from form slug
        if (($copy_form_name = $request->get('copyFrom')) != null) {
            $form   = Form::where('slug', $copy_form_name)->firstOrFail();
            $fields = $form->fields;
        }

        // generate the new form with empty fields or copied fields from another form
        $form = Form::create(['fields' => $fields] + $request->all());

        return new FormResource($form);
    }

    public function destroy(Form $form)
    {
        $form->delete();

        return response()->noContent();
    }
}
