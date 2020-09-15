<?php

namespace App\Http\Resources\Assessment;

use Illuminate\Http\Resources\Json\ResourceCollection;

class QuestionResourceCollection extends ResourceCollection
{
    public $collects = QuestionResource::class;
}
