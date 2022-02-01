<?php

namespace App\Traits;

trait SanitationStation
{
    /**
     * Removes the style attribute from all the elements except tables.
     * Also removed html comments on a single line.
     * @param $html
     * @return array|string|string[]|null
     */
    public static function sanitize($html)
    {
        return preg_replace("/(<(?!\/*table)\w+)\sstyle=\"[^\"]+\"|<!--.*-->/mi", "$1", $html);
    }
}
