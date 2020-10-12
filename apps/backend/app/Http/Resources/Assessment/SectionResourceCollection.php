<?php

namespace App\Http\Resources\Assessment;

use Illuminate\Http\Resources\Json\ResourceCollection;

class SectionResourceCollection extends ResourceCollection
{
    // @note it should collect this by naming convention if omitted
    public $collects = SectionResource::class;
}
