<?php

namespace App\Http\Resources\Assessment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name ?? '',
            'title'         => $this->title ?? '',
            'section_type'  => $this->section_type ?? '',
            'position'      => $this->position ?? 0,
            'questions'     => new QuestionResourceCollection($this->questions),
            'childSections' => new SectionResourceCollection($this->children),
        ];
    }
}
