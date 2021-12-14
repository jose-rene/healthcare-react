<?php

namespace App\Services;

use App\Interfaces\ReportBuilder;
use App\Interfaces\ToPDF;

class ReportBuilderService implements ReportBuilder
{
    private ToPDF $toPDF;
    private LambdaInvoke $lambda;

    public function __construct(ToPDF $to_pdf, LambdaInvoke $lambda)
    {
        $this->toPDF  = $to_pdf;
        $this->lambda = $lambda;
    }

    public function buildHtml($template, $data = [], $template_builder_function = 'template-builder')
    {
        $lambda = $this->lambda;

        $template_data = [
            "data"     => $data,
            "template" => $template,
        ];

        // generate the html template
        return $lambda->handler($template_builder_function, $template_data);
    }

    public function htmlToPDF($template, $config = []): string
    {
        $to_pdf = $this->toPDF;

        $pdf_config = [
                'author'   => 'Periscope',
                'content'  => $template,
                'template' => 'Periscope_Letterhead.pdf',
                'pwd'      => '',
            ] + $config;

        // generate the pdf from html template
        return $to_pdf
            ->setData($pdf_config)
            ->toReport();
    }
}
