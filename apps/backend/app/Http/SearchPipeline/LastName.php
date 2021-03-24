<?php

namespace App\Http\SearchPipeline;

class LastName extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        return $builder->where('last_name', 'like', "{$param}%");
    }
}
