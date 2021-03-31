<?php

namespace App\Http\SearchPipeline;

use DB;

class Dob extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        return $builder->whereDate(DB::raw('DATE(dob)'), 'like', date('Y-m-d', strtotime($param)));
    }
}
