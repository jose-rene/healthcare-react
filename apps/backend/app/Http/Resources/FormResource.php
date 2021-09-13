<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FormResource extends JsonResource
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
            'slug'        => $this->slug,
            'name'        => $this->name,
            'description' => $this->description,
            'fields'      => $this->fields,

            // returns the latest answers
            'answers'     => $this->userAnswers()->first()->form_data ?? null,
        ];
    }
}
