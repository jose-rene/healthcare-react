<?php

namespace App\Http\Controllers\Api;

use App\Events\FormAnswerSavedEvent;
use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Models\Form;
use App\Models\Request as ModelRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class RequestFormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param ModelRequest $request
     * @return AnonymousResourceCollection
     */
    public function index(ModelRequest $request)
    {
        // TODO :: this controller function should include if the form has been stared for the request.
        $forms    = Form::paginate(request('perPage', 100));
        $sections = $request->requestFormSections->keyBy('form_section_id');

        $forms->map(function ($f) use ($sections) {
            if (isset($sections[$f->id])) {
                $f->section      = $sections[$f->id];
                $f->is_started   = (bool)$sections[$f->id]->started_at;
                $f->is_completed = (bool)$sections[$f->id]->completed_at;
            } else {
                $f->is_started   = false;
                $f->is_completed = false;
            }

            return $f;
        });

        return FormResource::collection($forms);
    }

    /**
     * Display the specified resource.
     *
     * @param Form $form
     * @return FormResource
     */
    public function show(ModelRequest $request, Form $form)
    {
        return new FormResource($form);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ModelRequest $request
     * @param Form         $form
     * @return Response
     */
    public function update(ModelRequest $request, Form $form)
    {
        // TODO :: save the form answers to the
        // request_form_sections table

        $answers = [];

        if (!request('quick_save')) {
            FormAnswerSavedEvent::dispatch($answers);
        }

        return response()->noContent();
    }
}
