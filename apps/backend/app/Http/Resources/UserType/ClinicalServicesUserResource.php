<?php

namespace App\Http\Resources\UserType;

use Illuminate\Http\Resources\Json\JsonResource;

class ClinicalServicesUserResource extends JsonResource
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
            'clinical_type'        => $this->type,
            'clinical_user_status' => $this->status,
            'clinical_user_type'   => $this->userType,
            'date_hired'           => $this->date_hired,
            'is_preferred'         => $this->is_preferred,
            'is_test'              => $this->is_test,
            'note'                 => $this->note,
            'therapy_network'      => $this->therapyNetwork,
            'title'                => $this->title,
        ];
    }
}
