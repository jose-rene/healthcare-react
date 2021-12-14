<?php

namespace App\Services;

use App\Interfaces\ToPDF;
use App\Library\ToPdfAddTable;
use Arr;
use Exception;
use PDFlib;

class ToPdfLib extends ToPDF
{
    protected PDFlib $pdfLib;
    private int $pageNumber = 1;

    public function __construct($configs)
    {
        $this->configs      = $configs;
        $this->font_checker = new FontChecker();

        $pdf_lib = new PDFlib();
        $this->font_checker->setPdfLib($pdf_lib)->getFonts();

        $this->pdfLib = $pdf_lib;
    }

    public function toReport($data = null)
    {
        $json = $data ?? $this->data;

        throw_if(!$json, 'missing-report-data');

        $author    = $json["author"];
        $sig       = ''; // TODO :: FIX SIGNATURE "sigs/" . strtolower(str_replace(" ", "_", $author)) . ".png";
        $content   = $json["content"];
        $template  = $json["template"];
        $pwd       = $json["pwd"];
        $passwords = $pwd ? " masterpassword=" . $pwd . chr(10) . " userpassword=periscope" : "";
        $encoding  = 'unicode';
        $embedding = 'true';

        // page margins
        $horz_margin    = $this->configs['page_horzmargin'];
        $vert_margin    = $this->configs['page_vertmargin'];
        $content_width  = $this->configs['page_width'] - $horz_margin * 2;
        $content_height = $this->configs['page_height'] - $vert_margin * 2;

        //NOTE: these fonts must exist inside /fonts/

        $font_body     = $this->configs['font_body'];
        $font_bold     = $this->configs['font_bold'];
        $font_light    = $this->configs['font_light'];
        $font_italic   = $this->configs['font_italic'];
        $font_angelina = $this->configs['font_angelina'];
        $bodyfs        = 10;
        $h0fs          = 20;
        $leading       = "100%";


        $page_width  = $this->configs['page_width'];
        $page_height = $this->configs['page_height'];


        $searchpath = config('filesystems.fonts_path');

        /* create a new PDFlib object */
        ob_start();
        $pdf_lib = $this->pdfLib;

        $pdf_lib->set_option("errorpolicy=exception");
        $pdf_lib->set_option("SearchPath={{" . $searchpath . "}}");

        $pdflib_key = Arr::get($this->configs, 'pdflib_key');
        if ($pdflib_key) {
            $pdf_lib->set_option("license=$pdflib_key");
        }

        /* all strings are expected as utf8*/
        $pdf_lib->set_option("stringformat=utf8");

        $options = [
            'linearize=true',
            'optimize=true',
            'pagelayout=singlepage',
            'viewerpreferences ={fitwindow=true}',
        ];

        if ($passwords) {
            $options[] = $passwords;
        }

        $doc_options = " " . implode(" ", $options) . " ";

        $pdf_lib->begin_document("", $doc_options);

        $pdf_lib->set_info("Creator", "app.Periscope");
        $pdf_lib->set_info("Author", $author);
        $pdf_lib->set_info("Title", "Narrative Report");


        $font  = $pdf_lib->load_font($font_body, "unicode", "embedding errorpolicy=return");
        $fontb = $pdf_lib->load_font($font_bold, "unicode", "embedding errorpolicy=return");
        $fontl = $pdf_lib->load_font($font_light, "unicode", "embedding errorpolicy=return");
        $fonti = $pdf_lib->load_font($font_italic, "unicode", "embedding errorpolicy=return");
        $fonta = $pdf_lib->load_font($font_angelina, "unicode", "embedding errorpolicy=return");

        $fontname  = $pdf_lib->get_string($pdf_lib->info_font($font, "fontname", "api"), "");
        $fontnameb = $pdf_lib->get_string($pdf_lib->info_font($fontb, "fontname", "api"), "");
        $fontnamel = $pdf_lib->get_string($pdf_lib->info_font($fontl, "fontname", "api"), "");

        if ($font == 0) {
            throw new Exception("Error: " . $pdf_lib->get_errmsg());
        }

        $strokecolor      = " fillcolor={rgb 0.0 0.0 0.0}";
        $strokecolor_red  = " fillcolor={rgb 1.0 0.0 0.0}";
        $strokecolor_blue = " fillcolor={rgb 0.0 0.5 0.5}";

        $h0fs  = 20;
        $h1fs  = ($h0fs * .9);
        $h2fs  = ($h0fs * .8);
        $h3fs  = ($h0fs * .7);
        $h4fs  = ($h0fs * .6);
        $h5fs  = ($h0fs * .5);
        $break = "----------";

        $text = $content;

        $S1 = "<macro { S0 { fakebold=false } S1 {fakebold=true }}><&S1>";                                         //strong
        $I1 = "<macro { I0 { font=" . $font . "} I1 {font=" . $fonti . " }}><&I1>";                                //italic
        $E1 = "<macro { E0 { fakebold=false font=" . $font . "} E1 { fakebold=true font=" . $fonti . " }}><&E1>";  //emphasis


        $H1 = "<macro { H0 { fakebold=false font=" . $font . " fontsize=" . $bodyfs . " leading=" . $leading . " } H1 { fontsize=" . $h0fs . " fakebold=true font=" . $font . "}}><&H1>";
        $H2 = "<macro { H2 { fakebold=false font=" . $font . " fontsize=" . $bodyfs . " leading=" . $leading . " " . $strokecolor . "  } H3 { fontsize=" . $h1fs . " fakebold=false font=" . $font . " }}><&H3>";
        $H3 = "<macro { H4 { fakebold=false font=" . $font . " fontsize=" . $bodyfs . " leading=" . $leading . " } H5 { fontsize=" . $h2fs . "  leading=" . ($leading) . " fakebold=false font=" . $font . "}}><&H5>";
        $H4 = "<macro { H6 { fakebold=false font=" . $font . " fontsize=" . $bodyfs . " leading=" . $leading . " } H7 { fontsize=" . $h3fs . "  leading=" . ($leading) . " fakebold=false font=" . $font . "}}><&H7>";
        $H5 = "<macro { H8 { fakebold=false font=" . $font . " fontsize=" . $bodyfs . " leading=" . $leading . " } H9 { fontsize=" . $h4fs . "  leading=" . ($leading) . " fakebold=false font=" . $font . "}}><&H9>";
        $H6 = "<macro { H10 { fakebold=false font=" . $font . " fontsize=" . $bodyfs . " leading=" . $leading . " } H11 { fontsize=" . $h5fs . "  leading=" . ($leading) . " fakebold=false font=" . $font . "}}><&H11>";


        $spositions = [];
        $epositions = [];
        $sneedle    = "<table";
        $eneedle    = "</table>";
        $lastSPos   = 0;
        $lastEPos   = 0;
        $tables     = [];

        while (($lastSPos = strpos($text, $sneedle, $lastSPos)) !== false) {
            $spositions[] = $lastSPos;
            $lastSPos     = $lastSPos + strlen($sneedle);
        }
        while (($lastEPos = strpos($text, $eneedle, $lastEPos)) !== false) {
            $epositions[] = $lastEPos;
            $lastEPos     = $lastEPos + strlen($eneedle);
        }
        // create an array of all tables in the content
        foreach ($spositions as $key => $value) {
            $tables[] = substr($text, $spositions[$key], $epositions[$key] - $spositions[$key] + strlen($eneedle));
        }

        // replace table HTML with placeholder
        foreach ($tables as $t) {
            $text = str_ireplace($t, "--TABLE HERE--", $text);
        }

        $text = str_ireplace('<p>', '', $text);
        $text = str_ireplace('</p>', chr(10), $text);
        $text = str_ireplace('<br />', chr(10), $text);

        $text = str_ireplace('<ol>', '', $text);
        $text = str_ireplace('</ol>', '', $text);

        $text = str_ireplace('<u>', '<underline>', $text);
        $text = str_ireplace('</u>', '<underline=false>', $text);

        $text = str_ireplace('<ul>', '', $text);
        $text = str_ireplace('</ul>', '', $text);

        $text = str_ireplace('<li>', chr(9) . '&#x2022;  ', $text);
        $text = str_ireplace('</li>', '', $text);

        $text = str_ireplace('<strong>', $S1, $text);
        $text = str_ireplace('</strong>', '<&S0>', $text);

        $text = str_ireplace('<i>', $I1, $text);
        $text = str_ireplace('</i>', '<&I0>', $text);

        $text = str_ireplace('<em>', $E1, $text);
        $text = str_ireplace('</em>', '<&E0>', $text);

        $text = str_ireplace('<H1>', $H1, $text);
        $text = str_ireplace('</H1>', '<&H0>', $text);

        $text = str_ireplace('<H2>', $H2, $text);
        $text = str_ireplace("</H2>", "<&H2>", $text);

        $text = str_ireplace('<H3>', $H3, $text);
        $text = str_ireplace('</H3>', '<&H4>', $text);

        $text = str_ireplace('<H4>', $H4, $text);
        $text = str_ireplace('</H4>', '<&H6>', $text);

        $text = str_ireplace('<H5>', $H5, $text);
        $text = str_ireplace('</H5>', '<&H8>', $text);

        $text = str_ireplace('<H6>', $H6, $text);
        $text = str_ireplace('</H6>', '<&H10>', $text);


        $text = str_ireplace('<br>', $break, $text);

        // page numbering properties

        $pgno = $this->pageNumber;

        $itemTFO = "ruler={20 40 60 80} tabalignment={left left left left} " .
            "encoding=" .
            $encoding . " embedding=" .
            $embedding . " charref=true  fontname {" .
            $fontname . "} fontsize=" .
            $bodyfs . " hortabmethod=ruler  leading=" . $leading . " ";

        $table_options = "fittextline {fontname {" . $fontname . "} encoding=unicode fontsize=" . $bodyfs . " embedding position {left top}}";

        $page_sections = explode("--TABLE HERE--", $text);

        $pdf_lib->begin_page_ext(0, 0, "width=" . $page_width . " height=" . $page_height);

        $templatename = $this->configs['template_path'] . '/' . $template;

        if ($template != "blank") {
            $stationery = $pdf_lib->open_pdi_document($templatename, "");
            $page       = $pdf_lib->open_pdi_page($stationery, 1, "");

            $pdf_lib->fit_pdi_page($page, 0, $page_height,
                "position={left top}");
            $pdf_lib->close_pdi_page($page);
            $pdf_lib->close_pdi_document($stationery);
        }

        $ury = $page_height - ($vert_margin * 2);

        foreach ($page_sections as $section => $text) {
            // add heading if this is first page
            if ($section == 0) {
                $TFOC     = " encoding=" . $encoding . " embedding=" . $embedding . " textrendering=0 fontname {" . $fontnameb . "} fontsize=" . $h0fs . " leading=" . $leading . " alignment=right ";
                $TF       = $pdf_lib->create_textflow("NARRATIVE REPORT", $TFOC . $strokecolor);
                $TFResult = $pdf_lib->fit_textflow($TF, 0, $page_height - $vert_margin, ($page_width - $horz_margin),
                    $page_height - 80, " showborder=false rewind=0 ");
                $ury      = $pdf_lib->info_textflow($TF, "textendy") - 20;
            }

            $TF       = $pdf_lib->create_textflow($text, $itemTFO . $strokecolor);
            $TFResult = $pdf_lib->fit_textflow($TF, $horz_margin, ($vert_margin), ($page_width - $horz_margin), $ury,
                " showborder=false rewind=1 ");
            $ury      = $pdf_lib->info_textflow($TF, "textendy");


            if (isset($tables[$section])) {
                $newtbl                = new ToPdfAddTable();
                $newtbl->p             = $pdf_lib;
                $newtbl->pgno          = $pgno;
                $newtbl->table         = $tables[$section];
                $newtbl->fontname      = $fontname;
                $newtbl->fontsize      = $bodyfs;
                $newtbl->content_width = $content_width;
                $newtbl->llx           = $horz_margin;
                $newtbl->lly           = $vert_margin;
                $newtbl->page_height   = $page_height;
                $newtbl->page_width    = $page_width;
                $newtbl->vert_margin   = $vert_margin;
                $newtbl->ury           = $ury;
                $newtbl->urx           = $page_width - $horz_margin;
                $newtbl->table_options = $table_options;

                $tabresults = $newtbl->placeTable();

                //$p = $tabresults[0];
                $pgno = $tabresults[0];
                $ury  = $tabresults[1];
            }

            // Loop until all of the text is placed; create new pages

            if ($TFResult == "_boxfull") {
                $this->addNewPage($pdf_lib, $pgno, $fontname, $page_width, $page_height);
                $ury = $page_height - $vert_margin;
                $pgno++;
                $TFResult = $pdf_lib->fit_textflow($TF, $horz_margin, $vert_margin, $page_width - $horz_margin, $ury,
                    " showborder=false rewind=0 ");
                $ury      = $pdf_lib->info_textflow($TF, "textendy");
            }
        }

        if ($TFResult == "_stop") {
            if ($ury < 120) {
                $this->addNewPage($pdf_lib, $pgno, $fontname, $page_width, $page_height);
                $ury = $page_height - ($vert_margin);
            }

            if (false) // TODO :: fix signature
            {
                $this->addSignature($pdf_lib, $sig, $horz_margin, $ury);

                if (isset($sig)) {
                    $TFOC     = " encoding=" . $encoding . " embedding=" . $embedding . " textrendering=0 fontname {" . $fontnameb . "} fontsize=" . $h0fs . " leading=" . $leading . " alignment=left ";
                    $TF       = $pdf_lib->create_textflow($author, $TFOC . $strokecolor);
                    $TFResult = $pdf_lib->fit_textflow($TF, $horz_margin, ($ury - 100), $page_width - 100, $ury - 80,
                        " showborder=false rewind=1 ");
                }
            }
            $this->addPageNo($pdf_lib, $pgno, $fontname, $page_width);
        }

        $pdf_lib->end_page_ext("");
        $pdf_lib->end_document("");

        return $pdf_lib->get_buffer();
    }

    public function addNewPage($p, $pgno, $fontname, $pageWidth, $pageHeight)
    {
        // add page number at footer
        $this->addPageNo($p, $pgno, $fontname, $pageWidth);
        $p->end_page_ext("");
        $p->begin_page_ext(0, 0, "width=" . $pageWidth . " height=" . $pageHeight);
    }

    public function addPageNo($p, $pgno, $fontname, $pageWidth)
    {
        $TFO    = " encoding=unicode embedding=true textrendering=0 fontname {" . $fontname . "} fontsize=9 alignment=center";
        $llx    = 0;
        $urx    = $pageWidth;
        $txt    = "pg." . $pgno;
        $TF     = $p->create_textflow($txt, $TFO);
        $result = $p->fit_textflow($TF, $llx, 6, $urx, 16, "");
    }

    public function addSignature($p, $sigfile, $x1, $y1)
    {
        $image = $p->load_image("auto", $sigfile, "");
        if ($image == 0) {
            echo("Error: " . $p->get_errmsg());
            exit(1);
        }
        $p->fit_image($image, $x1, $y1 - 110, " boxsize {240 120}  fitmethod meet position=center");
    }
}
