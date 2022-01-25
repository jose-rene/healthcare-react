<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequestDetailResource;
use App\Interfaces\ReportBuilder;
use App\Models\NarrativeReport;
use App\Models\NarrativeReportTemplate;
use App\Models\Request as ModelRequest;
use Illuminate\Http\Response;

//use Illuminate\Http\Request;

class RequestNarrativeReportTemplateController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param                         $request_name
     * @param NarrativeReportTemplate $narrativeReportTemplate
     * @return Response
     */
    public function show(
        $request_name,
        NarrativeReportTemplate $narrativeReportTemplate,
        ReportBuilder $reportBuilder
    ) {
        if ($request_name === 'no_report_test_json') {
            $request_data = $narrativeReportTemplate->test_json;
        } else {
            $request      = ModelRequest::findOrFail($request_name);
            $request_data = new RequestDetailResource($request);
        }

        $report_template = $narrativeReportTemplate->template;
        $template        = $reportBuilder->buildHtml($report_template, $request_data);

        return response()->json(compact('template'));
    }

    public function update(
        ModelRequest $request,
        NarrativeReportTemplate $narrativeReportTemplate
    ) {
        $template = request('template');

        $search = [
            'narrative_report_template_id' => $narrativeReportTemplate->id,
            'request_id'                   => $request->id,
        ];

        $narrative_report = NarrativeReport::updateOrCreate($search, $search + [
                'text' => $template,
            ]);

        return response()->json(['narrative_report_id' => $narrative_report->id]);
    }
}
