<?php

namespace App\Http\Controllers\Api;

use App\Events\RequestFormSectionSavedEvent;
use App\Http\Controllers\Controller;
use App\Http\Resources\RequestFormSectionResource;
use App\Jobs\CheckFormAnswersJob;
use App\Models\Form;
use App\Models\Request;
use App\Models\RequestFormSection;
use Carbon\Carbon;

class RequestFormSectionController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param \App\Models\Request            $request
     * @param \App\Models\RequestFormSection $requestFormSection
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Form $form)
    {
        $section = RequestFormSection::firstOrCreate([
            'form_section_id' => $form->id,
            'request_id'      => $request->id,
        ], ['answer_data' => []]);

        return new RequestFormSectionResource($section);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request       $request
     * @param \App\Models\Request            $request
     * @param \App\Models\RequestFormSection $requestFormSection
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Form $form)
    {
        $section = RequestFormSection::firstOrCreate([
            'form_section_id' => $form->id,
            'request_id'      => $request->id,
        ], ['answer_data' => []]);

        $section->answer_data = request('form_data');

        if (!$section->started_at) {
            $section->started_at = new Carbon;
        }

        $section->save();

        if (request('completed_form', false) === true) {
            $answers = $form->userAnswers()->first();
            dispatch(new CheckFormAnswersJob($answers));
            RequestFormSectionSavedEvent::dispatch($section);
        }

        return response()->noContent();
    }
}
