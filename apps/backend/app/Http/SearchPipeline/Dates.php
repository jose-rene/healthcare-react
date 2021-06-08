<?php

namespace App\Http\SearchPipeline;

/**
 * Class Address
 * @package App\Http\SearchPipeline
 * @example ?address[address_id]=123%20fake%20st
 */
class Dates extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        foreach ($param as $key => $value) {
            switch ($key) {
                case "date_start":
                    $builder->where($key, '>=', $value);
                    break;
                case "date_end":
                    $builder->where($key, '<=', $value);
                    break;
                default:
                    $builder->where($key, $value);
            }
        }

        return $builder;
    }
}
