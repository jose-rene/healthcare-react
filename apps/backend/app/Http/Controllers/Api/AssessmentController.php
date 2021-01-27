<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assessment\AssessmentRequest;
use App\Http\Resources\Assessment\AssessmentResource;
use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use App\Models\Request as AppRequest;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * When Assessment Request is instantiated from service containter, validateResolved is called from FormRequest Service binding (afterResolved).
     * None of this code will run if the form is invalid, unless failedValidation is overridden in the custom request class.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AssessmentRequest $request)
    {
        if (!$request->has('questionnaire_id') || !is_numeric($request['questionnaire_id']) || null === ($questionnaire = Questionnaire::find($request['questionnaire_id']))) {
            return response()->json(['message' => 'Invalid Questionnaire'], 422);
        }
        if (!$request->has('request_id') || !is_numeric($request['request_id']) || null === ($req = AppRequest::find($request['request_id']))) {
            return response()->json(['message' => 'Invalid Request'], 422);
        }
        // @todo, check request is assigned to logged in user
        $user = auth()->user();
        // the validation is already ran due to the service binding, this is just retrieving the data
        $data = $request->validated();
        // array of errors
        $errors = $request->errors()->toArray();
        // make an array of invalid input, comes in handy when a required field is updated to blank
        $errorData = array_map(function ($item) {
            return '';
        }, $errors);
        // create the assessment
        $assessment = new Assessment();
        // attach foriegn entities
        $assessment->request()->associate($req);
        $assessment->questionnaire()->associate($questionnaire);
        $assessment->user()->associate($user);
        // save assessment to db
        $assessment->save();

        // save the submitted answers, merge in the blank fields ($errorData)
        $saveData = array_merge($data, $errorData);
        $request->saveAnswers($assessment, $saveData);

        return response()->json([
            'success' => 1,
            'message' => 'Assessment Saved!',
            'id'      => $assessment->uuid,
            'data'    => $data,
            'errors'  => $errors,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Assessment\Assessment  $assessment
     * @return \Illuminate\Http\Response
     */
    public function show(Assessment $assessment)
    {
        return new AssessmentResource($assessment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Assessment\Assessment  $assessment
     * @return \Illuminate\Http\Response
     */
    public function update(AssessmentRequest $request, Assessment $assessment)
    {
        $user = auth()->user();
        if ($user->id != $assessment->user->id) {
            return response()->json(['message' => 'Invalid Request'], 422);
        }
        // the validation is already ran due to the service binding, this is just retrieving the data
        $data = $request->validated();
        // dd($request->all());
        $errors = $request->errors()->toArray();
        $errorData = array_map(function ($item) {
            return '';
        }, $errors);
        // save the submitted anwsers
        $saveData = array_merge($data, $errorData);
        $request->saveAnswers($assessment, $saveData);

        return response()->json([
            'success' => 1,
            'message' => 'Assessment Updated!',
            'id'      => $assessment->id,
            'data'    => $data,
            'errors'  => $errors,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Assessment\Assessment  $assessment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Assessment $assessment)
    {
        //
    }
}
