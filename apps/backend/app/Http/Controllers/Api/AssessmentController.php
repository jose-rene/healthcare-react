<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assessment\AssessmentRequest;
use App\Http\Resources\Assessment\QuestionnaireResource;
use App\Http\Resources\Assessment\QuestionResource;
use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use Illuminate\Http\Request;

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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AssessmentRequest $request)
    {
        if (!$request->has('questionnaire_id') || !ctype_digit($request['questionnaire_id'])) {
            return response()->json(['message' => 'Invalid Questionnaire'], 422);
        }

        // will return 422 response if not valid
        $data = $request->validated();
        // @todo store answers and return success
        return response()->json(['success' => 1, 'message' => 'Questionnaire Saved', 'data' => $data], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Assessment\Assessment  $assessment
     * @return \Illuminate\Http\Response
     */
    public function show(Assessment $assessment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Assessment\Assessment  $assessment
     * @return \Illuminate\Http\Response
     */
    public function edit(Assessment $assessment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Assessment\Assessment  $assessment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Assessment $assessment)
    {
        //
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
