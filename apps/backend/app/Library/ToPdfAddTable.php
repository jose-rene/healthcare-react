<?php

namespace App\Library;

use DOMDocument;

class ToPdfAddTable
{
    public $p;
    public $pgno;
    public $table;
    public $fontname;
    public $fontsize;
    public $content_width;
    public $llx;
    public $lly;
    public $urx;
    public $ury;
    public $page_height;
    public $table_options;

    public function __construct()
    {
    }

    public function placeTable()
    {
        $p             = $this->p;
        $pgno          = $this->pgno;
        $content_width = $this->content_width;
        $fontname      = $this->fontname;
        $fontsize      = $this->fontsize;
        $table         = $this->table;
        $lly           = $this->lly;
        $llx           = $this->llx;
        $urx           = $this->urx;
        $ury           = $this->ury;
        $page_height   = $this->page_height;
        $page_width    = $this->page_width;
        $vert_margin   = $this->vert_margin;
        $table_options = $this->table_options;

        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->loadHTML($table);
        $dom->preserveWhiteSpace = false;
        $tbl                     = 0;

        $t           = $dom->getElementsByTagName('table');
        $border      = $t[0]->getAttribute('border');
        $style       = $t[0]->getAttribute('style');
        $table_width = $content_width * number_format(explode("%;", explode("width: ", $style)[1])[0] / 100, 2);

        /*** get all rows from the table ***/
        $rows = $t->item(0)->getElementsByTagName('tr');

        /*** loop over the table rows ***/
        foreach ($rows as $r => $row) {
            /*** get each column by tag name ***/
            $cols = $row->getElementsByTagName('td');

            foreach ($cols as $c => $col) {
                $nodeValue = $col->nodeValue;
                $cw        = ($table_width / count($cols));
                $tf        = $p->add_textflow(0, $nodeValue,
                    "encoding=unicode fontname=" . $fontname . " fontsize=" . $fontsize . " leading=110% charref");
                $tfo       = "textflow=" . $tf . " fittextflow={firstlinedist=capheight} colwidth=" . $cw . " rowheight=1  margin=4";
                $tbl       = $p->add_table_cell($tbl, ($c + 1), ($r + 1), "", $tfo);
            }
        }
        $optlist = " rowheightdefault=auto "
            //. "fill={{area=rowodd fillcolor={gray 0.9}}} "
            . "stroke={{line=other linewidth=" . $border . " }} ";

        /* Place the table instance */
        $result = $p->fit_table($tbl, $llx, $lly, $urx, $ury, $optlist);

        if ($result == "_boxfull") {
            addPageNo($p, $pgno, $fontname, $page_width);
            $pgno++;
            $p->end_page_ext("");
            $p->begin_page_ext(0, 0, "width=" . $page_width . " height=" . $page_height);
            $ury    = ($page_height - $vert_margin);
            $result = $p->fit_table($tbl, $llx, $vert_margin, $urx, $ury, $optlist);
        }

        $tabheight = $ury - $p->info_table($tbl, "height");
        $p->delete_table($tbl, "");
        return [$pgno, $tabheight];
    }
}
