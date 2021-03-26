<?php

namespace App\Http\Resources\Assessment;

use Illuminate\Http\Resources\Json\ResourceCollection;

class AssessmentResourceCollection extends ResourceCollection
{
    public $collects = AssessmentResource::class;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // just return the assessment id
        return $this->collection->transform(function ($assessment) {
            return [
                'id' => $assessment->uuid,
            ];
        });
    }
}
