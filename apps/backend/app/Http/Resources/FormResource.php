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
//        $forms = Form::all();

        return [
            'id'          => $this->id,
            'slug'        => $this->slug,
            'name'        => $this->name,
            'description' => $this->description,
            'fields'      => $this->fields,
            'updated_at'  => $this->updated_at->format('m/d/Y H:i:s'),

            // optional stuff
            //                'answers'     => $this->whenLoaded('formSection', $this->formSection->answer_data),
            //                'forms' => Form::all(),
        ];
    }
}
