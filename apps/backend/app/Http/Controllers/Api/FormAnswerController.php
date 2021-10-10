<?php

namespace App\Http\Controllers\Api;

use App\Events\FormAnswerSavedEvent;
use App\Http\Controllers\Controller;
use App\Http\Resources\FormAnswerResource;
use App\Jobs\CheckFormAnswersJob;
use App\Models\Form;
use App\Models\FormAnswer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FormAnswerController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @param Form    $form
     * @return Response
     */
    public function store(Request $request, Form $form)
    {
        $answers_found = $form->userAnswers()->first();
        $data          = ['form_data' => $request->get('form_data', [])];

        if ($answers_found) {
            abort_if($answers_found->completed_at !== null, 422, 'form-complete');

            // Update the form answer that has been started already
            $answers_found->update($data);
        } else {
            $form->userAnswers()->create($data);

            FormAnswer::create(['form_id' => $form->id] + $data);
        }

        if ($request->get('completed_form', false) === true) {
            $answers = $form->userAnswers()->first();
            dispatch(new CheckFormAnswersJob($answers));
            FormAnswerSavedEvent::dispatch($answers);
        }

        return response()->noContent();
    }

    /**
     * Display the specified resource.
     *
     * @param Form       $form
     * @param FormAnswer $formAnswer
     * @return Response
     */
    public function show(Form $form, FormAnswer $formAnswer)
    {
        $answers = $form->answers()->where('id', $formAnswer->id)->first();

        return new FormAnswerResource($answers);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request    $request
     * @param Form       $form
     * @param FormAnswer $formAnswer
     * @return Response
     */
    public function update(Request $request, Form $form)
    {
        $answers = $form->userAnswers()->first()->updateOrCreate(['form_data' => $request->get('form_data', [])]);

        if (!$request->get('quick_save', false)) {
            FormAnswerSavedEvent::dispatch($answers);
        }

        return response()->noContent();
    }
}
