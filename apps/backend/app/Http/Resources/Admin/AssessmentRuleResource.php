<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentRuleResource extends JsonResource
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
            'id'                => $this->id,
            'name'              => $this->name,
            'assessment_id'     => $this->assessment_id,
            'payer_id'          => $this->payer_id,
            'classification_id' => $this->classification_id,
            'request_type_id'   => $this->request_type_id,
        ];
    }
}
