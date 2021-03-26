<?php

namespace App\Http\Resources;

use App\Http\Resources\Assessment\AssessmentResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'          => $this->uuid,
            'assessments' => new AssessmentResourceCollection($this->assessments),
        ];
    }
}
