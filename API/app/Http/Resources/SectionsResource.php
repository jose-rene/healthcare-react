<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class SectionsResource extends ResourceCollection
{
    public $collects = SectionResource::class;
}
