<?php

namespace App\Services;

use App\Models\Icd10Code;
use Illuminate\Support\Facades\Cache;

class Icd10CodeLocalClient
{
    protected $raw;

    public function lookup($term)
    {
        $codes = Cache::store('database')->rememberForever($term, function() use(&$term) {
            // search local db
            $query = Icd10Code::where('code', 'LIKE', '%'.$term.'%');
            // if term does not match a code pattern, search for description too
            if (!preg_match('~^[A-Za-z]\d+~', $term)) {
                $query->orWhere('description', 'LIKE', '%'.$term.'%');
            }
            $data = $query->limit(50)->get();
            return $data->map(fn($item) => ['value' => $item['code'], 'label' => $item['code'] . ' - ' . $item['description']]);
        });

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
