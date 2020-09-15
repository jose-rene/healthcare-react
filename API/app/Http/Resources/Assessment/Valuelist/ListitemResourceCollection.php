<?php

namespace App\Http\Resources\Assessment\Valuelist;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ListitemResourceCollection extends ResourceCollection
{
    public $collects = ListitemResource::class;
}
