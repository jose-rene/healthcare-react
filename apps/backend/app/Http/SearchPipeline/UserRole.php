<?php

namespace App\Http\SearchPipeline;

class UserRole extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        $roles = $param;

        if(!is_array($roles)){
            $roles = [$roles];
        }

        return $builder->whereHas(
            'roles', function($q) use ($roles) {
                $q->whereIn('name', $roles);
            });
    }
}
