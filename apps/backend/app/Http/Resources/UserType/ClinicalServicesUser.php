<?php

namespace App\Http\Resources\UserType;

use Illuminate\Http\Resources\Json\JsonResource;

class ClinicalServicesUser extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
