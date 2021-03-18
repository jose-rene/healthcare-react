<?php

namespace App\Http\Resources;

use Carbon\Carbon;
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
            'id'         => $this->uuid,
            'gender'     => $this->gender,
            'title'      => $this->name_title,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'dob'        => Carbon::parse($this->dob)->format('m/d/Y'),
            'address'    => new AddressResource($address),
        ];
    }
}
