<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Http\Requests\Admin\AssessmentRequest;
use App\Http\Resources\Admin\AssessmentResource;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $assessments = Assessment::paginate($request->get('perPage', 50));
        return AssessmentResource::collection($assessments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AssessmentRequest $request)
    {
        $assessment = Assessment::create($params = $request->validated());
        // attach the form sections
        if (!empty($params['forms'])) {
            // make into an array keyed by id, and remaining fields the data
            $forms = collect($params['forms'])
                ->mapWithKeys(fn($form, $id) => [$form['id'] => array_filter($form, fn($key) => $key !== 'id', \ARRAY_FILTER_USE_KEY)])->toArray();
            $assessment->forms()->sync($forms);
        }

        return new AssessmentResource($assessment);
    }

    /**
     * Display the specified resource.
     *
     * @param  Assessment $assessment
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AssessmentRequest $request, Assessment $assessment)
    {
        $assessment->update($params = $request->validated());
        // attach the form sections
        if (!empty($params['forms'])) {
            // make into an array keyed by id, and remaining fields the data
            $forms = collect($params['forms'])
                ->mapWithKeys(fn($form, $id) => [$form['id'] => array_filter($form, fn($key) => $key !== 'id', \ARRAY_FILTER_USE_KEY)])->toArray();
            $assessment->forms()->sync($forms);
        }

        return new AssessmentResource($assessment);
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
