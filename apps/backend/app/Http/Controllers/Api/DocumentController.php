<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileRequest;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\RequestDetailResource;
use App\Interfaces\ReportBuilder;
use App\Models\Document;
use App\Models\NarrativeReport;
use App\Models\NarrativeReportTemplate;
use App\Models\Request as ModelRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = Document::paginate($request->get('perPage', 50));

        return response()->json(compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param FileRequest $request
     * @return DocumentResource
     */
    public function store(FileRequest $request)
    {
        // Update database
        $document = Document::create($request->validated());

        // store file
        $document->file = $request->file('file');
        $document->save();

        return new DocumentResource($document);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param FileRequest $request
     * @param Document    $document
     * @return DocumentResource
     */
    public function update(FileRequest $request, Document $document)
    {
        // create new database entry
        $newDocument = Document::create($request->validated() + ['parent_id' => $document->id]);

        // store file
        $document->file = $request->file('file');

        return new DocumentResource($newDocument);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Document $document
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Document $document)
    {
        $document->delete();

        return response()->json(['message' => 'ok']);
    }

    public function generatePDF(
        NarrativeReportTemplate $narrative_report_template,
        ModelRequest $request,
        ReportBuilder $reportBuilder
    ) {
        // Use the resource to generate request data for this sample
        $request_data = new RequestDetailResource($request);
        $template     = '<div class="tinymce content">' . $narrative_report_template->template . '</div>';
        $style        = '.tinymce.content{ ' . $narrative_report_template->styles . '}';
        $filename     = 'some-pdf-file.pdf';

        $report_html = $reportBuilder->buildHtml($template, $request_data);
        $pdf         = $reportBuilder->htmlToPDF($report_html, compact('style'));

        // stream the pdf to the browser
        return response()->make($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }

    public function generateModifiedPDF(
        NarrativeReport $narrative_report,
        ReportBuilder $reportBuilder
    ) {
        // Use the resource to generate request data for this sample
        $filename = "narrative-report-{$narrative_report->id}.pdf";

        $report_html = $reportBuilder->buildHtml($narrative_report->text);
        $pdf         = $reportBuilder->htmlToPDF($report_html);

        // stream the pdf to the browser
        return response()->make($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }
}
