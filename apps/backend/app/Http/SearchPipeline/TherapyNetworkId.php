<?php

namespace App\Http\SearchPipeline;

class TherapyNetworkId extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        return $builder->where('therapy_network_id', $param);
    }
}
