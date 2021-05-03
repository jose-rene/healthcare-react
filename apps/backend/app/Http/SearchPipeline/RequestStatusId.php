<?php


namespace App\Http\SearchPipeline;


class RequestStatusId extends BaseSearchPipeline
{

    protected function applyFilter($builder, $param)
    {
        $builder->where('request_status_id', $param);
    }
}
