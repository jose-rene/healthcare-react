<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class Icd10CodeApiClient
{
    protected $raw;

    public function lookup($term)
    {
        $key = 'ICD10~' . $term;
        $sf = 'code,name';
        // if it matches a code pattern search for code only
        if (preg_match('~^[A-Za-z]\d+~', $term)) {
            $sf = 'code';
        }
        $json = Cache::remember($key, now()->addDays(90), function () use (&$term, &$sf) {
            $response = Http::get('https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search', [
                'sf'      => $sf,
                'terms'   => $term,
                'maxList' => 50,
            ]);

            return $response->getBody()->getContents();
        });
        $this->raw = $codes = [];
        if (false !== ($data = json_decode($json, true))) {
            $this->raw = $data;
            $codes = !empty($data[3]) ? $data[3] : [];
            $codes = array_map(fn ($item) => ['value' => $item[0], 'label' => $item[0] . ' - ' . $item[1]], $codes);
        }

        return $codes;
    }

    /** Access the raw parsed json of the last api response.
     *
     * @return array raw data
     */
    public function getLastResponse()
    {
        return $this->raw;
    }
}
