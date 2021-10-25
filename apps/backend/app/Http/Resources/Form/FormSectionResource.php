<?php

namespace App\Http\Resources\Form;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FormSectionResource extends JsonResource
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
            'id'          => $this->id,
            'slug'        => $this->slug,
            'name'        => $this->pivot->name ? $this->pivot->name : $this->name,
            'description' => $this->pivot->description ? $this->pivot->description : $this->description,
            'position'    => $this->pivot->position,
            'fields'      => $this->fields,
            'updated_at'  => $this->updated_at->format('m/d/Y H:i:s'),
        ];
    }
}
