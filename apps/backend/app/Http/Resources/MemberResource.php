<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $address = $this->addresses->filter(function ($value, $key) {
            return $value->is_primary;
        })->first();

        return [
            'id'        => $this->uuid,
            'gender'    => $this->gender,
            'title'     => $this->name_title,
            'firstName' => $this->first_name,
            'lastName'  => $this->last_name,
            'address'   => new AddressResource($address),
        ];
    }
}
