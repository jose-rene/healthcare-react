<?php

namespace App\Http\Resources\Assessment;

use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
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
            'id'            => $this->uuid,
            'questionnaire' => ['id' => $this->questionnaire->uuid],
            'answers'       => new AnswerResourceCollection($this->answers),
        ];
    }
}
