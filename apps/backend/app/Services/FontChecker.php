<?php

namespace App\Services;

class FontChecker
{
    protected $fontDir;
    protected $pdfLib;

    public function __construct()
    {
        $this->fontDir = config('filesystems.fonts_path');
    }

    public function getFonts()
    {
        $fonts = [];
        $count = 0;

        $font_dir = $this->fontDir;
        $pdf_lib  = $this->pdfLib;

        $pdf_lib->set_option("SearchPath={{" . $font_dir . "}}");

        /* enumerate all fonts on the searchpath and create a UPR file */
        $pdf_lib->set_option("enumeratefonts saveresources={filename={font_lister_pdflib.upr}}");

        /* Retrieve the names of all enumerated fonts */
        do {
            $fontresource = $pdf_lib->get_option("FontOutline", "resourcenumber=" . ++$count);
            if ($fontresource == -1) {
                break;
            }
            $resourceentry = $pdf_lib->get_string($fontresource, "");
            $fonts[]       = explode(" = ", $resourceentry)[0];
        } while ($fontresource != -1);

        return ($fonts);
    }

    /**
     * @param mixed $pdfLib
     * @return FontChecker
     */
    public function setPdfLib($pdfLib)
    {
        $this->pdfLib = $pdfLib;
        return $this;
    }
}
