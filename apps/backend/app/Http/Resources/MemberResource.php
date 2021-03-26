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
        $phone = $this->phones->filter(function ($value, $key) {
            return $value->is_primary;
        })->first();
        // @todo add relationship fields when the db tables are made
        return [
            'id'            => $this->uuid,
            'gender'        => $this->gender,
            'title'         => $this->name_title,
            'first_name'    => $this->first_name,
            'last_name'     => $this->last_name,
            'member_number' => $this->member_number,
            'payer'         => $this->payer ? new PayerResource($this->payer) : null,
            'dob'           => Carbon::parse($this->dob)->format('m/d/Y'),
            'address'       => new AddressResource($address),
            'phone'         => new PhoneResource($phone),
        ];
    }
}
