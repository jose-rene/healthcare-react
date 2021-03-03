<?php

namespace App\Http\SearchPipeline;

class Search extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        return $builder->search($param);
    }
}
