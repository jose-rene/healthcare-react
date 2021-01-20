<?php

namespace App\Http\Resources\Assessment;

use Illuminate\Http\Resources\Json\ResourceCollection;

class AnswerResourceCollection extends ResourceCollection
{
    public $collects = AnswerResource::class;
}
