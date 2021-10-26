<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NarrativeReportTemplateRequest;
use App\Http\Resources\NarrativeReportTemplateResource;
use App\Models\NarrativeReportTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NarrativeReportTemplatesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $templates = NarrativeReportTemplate::paginate(request('perPage', 50));

        return NarrativeReportTemplateResource::collection($templates);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(NarrativeReportTemplateRequest $request)
    {
        $template = NarrativeReportTemplate::create($request->validated());

        return new NarrativeReportTemplateResource($template);
    }

    /**
     * Display the specified resource.
     *
     * @param NarrativeReportTemplate $narrative_report_template
     * @return Response
     */
    public function show(NarrativeReportTemplate $narrative_report_template)
    {
        return new NarrativeReportTemplateResource($narrative_report_template);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request                 $request
     * @param NarrativeReportTemplate $narrative_report_template
     * @return Response
     */
    public function update(NarrativeReportTemplateRequest $request, NarrativeReportTemplate $narrative_report_template)
    {
        $narrative_report_template->update($request->validated());

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param NarrativeReportTemplate $narrative_report_template
     * @return Response
     */
    public function destroy(NarrativeReportTemplate $narrative_report_template)
    {
        $narrative_report_template->delete();

        return response()->noContent();
    }
}
