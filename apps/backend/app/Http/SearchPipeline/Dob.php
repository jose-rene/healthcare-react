<?php

namespace App\Http\SearchPipeline;

class Dob extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        return $builder->whereDate('dob', '=', $param);
    }
}
