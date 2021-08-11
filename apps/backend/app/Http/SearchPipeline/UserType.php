<?php

namespace App\Http\SearchPipeline;

class UserType extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        return $builder->where('user_type', $param);
    }
}
