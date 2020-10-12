<?php

namespace App\Http\Resources\Assessment;

use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
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
            'id'            => $this->id,
            'title'         => $this->title ?? '',
            'ele_type'      => $this->ele_type ?? 'text',
            'question_type' => $this->question_type ?? '',
            'required'      => (int) $this->required,
            'valuelist'     => new Valuelist\ValuelistResource($this->valuelist),
        ];
    }
}
