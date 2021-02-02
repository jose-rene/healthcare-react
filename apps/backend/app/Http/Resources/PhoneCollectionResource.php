<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PhoneCollectionResource extends ResourceCollection
{
    public $collects = PhoneResource::class;
}
