<?php

namespace App\Http\Controllers\Api;

use App\Events\FormAnswerSavedEvent;
use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Models\Form;
use App\Models\Request as ModelRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class RequestFormController extends Controller
{
    private Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Display a listing of the resource.
     *
     * @param ModelRequest $request
     * @return AnonymousResourceCollection
     */
    public function index(ModelRequest $request)
    {
        // TODO :: this controller function should include if the form has been stared for the request.
        $forms = Form::paginate($this->request->get('perPage', 50));

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

        if (!$this->request->get('quick_save')) {
            FormAnswerSavedEvent::dispatch($answers);
        }

        return response()->noContent();
    }
}
