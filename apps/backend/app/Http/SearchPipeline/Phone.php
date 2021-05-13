<?php

namespace App\Http\SearchPipeline;

use Illuminate\Support\Str;

class Phone extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        $param = Str::of($param)
                ->replace(' ', '%')
                ->prepend('%')
                ->append('%') . '';

        return $builder->whereHas('phones', function ($q) use ($param) {
            $q->where('number', 'like', $param);
        });
    }
}
