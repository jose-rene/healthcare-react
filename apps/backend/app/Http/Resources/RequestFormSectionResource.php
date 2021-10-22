<?php

namespace App\Http\Resources;

use App\Models\RequestFormSection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RequestFormSection */
class RequestFormSectionResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'slug'            => $this->sectionForm->slug,
            'name'            => $this->sectionForm->name,
            'answer_data'     => $this->answer_data,
            'fields'          => $this->sectionForm->fields ?? [],
            'form_section_id' => $this->form_section_id,
            'request_id'      => $this->request_id,
            'completed_at'    => $this->completed_at,
            'started_at'      => $this->started_at,
        ];
    }
}
