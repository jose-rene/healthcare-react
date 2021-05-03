<?php


namespace App\Http\SearchPipeline;


class AuthNumber extends BaseSearchPipeline
{

    protected function applyFilter($builder, $param)
    {
        $builder->where('auth_number', $param);
    }
}
