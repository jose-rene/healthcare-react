<?php

namespace App\Listeners;

use App\Events\RequestStatusChangedEvent;
use App\Http\Resources\RequestDetailResource;
use App\Interfaces\ReportBuilder;
use App\Models\NarrativeReport;
use App\Models\NarrativeReportTemplate;

class RequestChangedListener
{
    private ReportBuilder $reportBuilder;

    public function __construct(ReportBuilder $reportBuilder)
    {
        $this->reportBuilder = $reportBuilder;
    }

    /**
     * Handle the event.
     *
     * @param RequestStatusChangedEvent $event
     * @return void
     */
    public function handle(RequestStatusChangedEvent $event)
    {
        $report_builder            = $this->reportBuilder;
        $narrative_report_template = NarrativeReportTemplate::first();

        $finder = [
            'request_id'                   => $event->request->id,
            'narrative_report_template_id' => $narrative_report_template->id,
        ];

        // Check to see if the NarrativeReport has been created already.
        if (NarrativeReport::where($finder)->exists()) {
            return true;
        }

        // Narrative report not exists yet create it.
        $request_data = new RequestDetailResource($event->request);
        $template     = $narrative_report_template->template;
        $filename     = 'some-pdf-file.pdf';

        $report_html = $report_builder->buildHtml($template, $request_data);


        // Store the template to the database
        NarrativeReport::create($finder, $finder + [
                'text' => $report_html,
            ]);
    }
}
