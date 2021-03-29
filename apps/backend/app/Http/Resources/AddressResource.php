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
            'address_1'   => $this->address_1,
            'address_2'   => $this->address_2 ?? '',
            'city'        => $this->city,
            'county'      => $this->county,
            'state'       => $this->state,
            'postal_code' => $this->postal_code,
        ];
    }
}
