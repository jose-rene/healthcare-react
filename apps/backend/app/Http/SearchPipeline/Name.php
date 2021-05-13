<?php

namespace App\Http\SearchPipeline;

class Name extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        $param = str_replace(' ', '%', $param);
        return $builder->where('name', 'like', "%{$param}%");
    }
}
