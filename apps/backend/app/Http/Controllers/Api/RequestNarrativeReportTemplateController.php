<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequestDetailResource;
use App\Interfaces\ReportBuilder;
use App\Models\NarrativeReportTemplate;
use App\Models\Request as ModelRequest;
use Illuminate\Http\Response;

//use Illuminate\Http\Request;

class RequestNarrativeReportTemplateController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param ModelRequest            $request
     * @param NarrativeReportTemplate $narrativeReportTemplate
     * @return Response
     */
    public function show(
        ModelRequest $request,
        NarrativeReportTemplate $narrativeReportTemplate,
        ReportBuilder $reportBuilder
    ) {
        $report_template = $narrativeReportTemplate->template;
        $request_data    = new RequestDetailResource($request);
        $template        = $reportBuilder->buildHtml($report_template, $request_data);

        return response()->json(compact('template'));
    }
}
