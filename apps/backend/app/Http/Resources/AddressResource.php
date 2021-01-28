<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
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
            'street'   => $this->street,
            'city'     => $this->city,
            'county'   => $this->county,
            'state'    => $this->state,
            'zip_code' => $this->postal_code,
        ];
    }
}
