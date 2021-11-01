<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AssessmentRuleResource;
use App\Http\Requests\Admin\AssessmentRuleRequest;
use App\Models\AssessmentRule;
use Illuminate\Http\Request;

class AssessmentRuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $rules = AssessmentRule::paginate($request->get('perPage', 50));
        return AssessmentRuleResource::collection($rules);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AssessmentRuleRequest $request)
    {
        $rule = AssessmentRule::create($request->validated());

        return new AssessmentRuleResource($rule);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(AssessmentRule $assessment_rule)
    {
        return new AssessmentRuleResource($assessment_rule);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
