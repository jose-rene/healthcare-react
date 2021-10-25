<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Form\FormSectionResource;
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
        // extra fields in forms will be pivot_name, etc
        return [
            'id'          => $this->uuid,
            'name'        => $this->name,
            'description' => $this->description,
            'sections'    => $this->forms ? FormSectionResource::collection($this->forms) : [],
        ];
    }
}
