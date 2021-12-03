<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Form\FormListResource;
use App\Http\Resources\FormResource;
use App\Models\Form;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Venturecraft\Revisionable\Revision;

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

    public function snapshot(Form $form)
    {
        // I had to build this out manually, I tried to trigger a revision save
        // on a field, but I could not see a way to do it, so I manually generate
        // the record here
        // FIXME :: try to use the revision package to generate this
        $revision_history = new Revision();

        $revision_history->key               = 'fields';
        $revision_history->revisionable_type = Form::class;
        $revision_history->revisionable_id   = $form->id;
        $revision_history->user_id           = auth()->id();
        $revision_history->old_value         = json_encode($form->fields);
        $revision_history->new_value         = '[]';

        $revision_history->save();

        return response()->noContent();
    }

    public function rollback(Form $form)
    {
        $revision_id = request('revision_id');
        throw_if(!$revision_id, 'invalid-revision_id');

        $revision = $form->revisionHistory()
            ->where('id', $revision_id)
            ->where('key', 'fields')
            ->firstOrFail();

        $form->update(['fields' => json_decode($revision->old_value)]);

        return new FormResource($form);
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
