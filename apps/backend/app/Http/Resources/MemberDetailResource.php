<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $address = $this->addresses->filter(function ($value, $key) {
            return $value->is_primary;
        })->first();

        return [
            'id'            => $this->uuid,
            'gender'        => $this->gender,
            'title'         => $this->name_title,
            'name'          => $this->name,
            'first_name'    => $this->first_name,
            'last_name'     => $this->last_name,
            'member_number' => $this->member_number,
            'payer'         => $this->payer ? new PayerDetailResource($this->payer) : null,
            'lob'           => $this->lob ? new LobResource($this->lob) : null,
            'dob'           => $this->dob->format('m/d/Y'),
            'address'       => new AddressResource($address),
            'phone'         => new PhoneResource($this->mainPhone),
            'email'         => new EmailResource($this->mainEmail),
            'language'      => $this->language ? $this->language->name : 'English',
            'language_id'   => $this->language_id,
        ];
    }
}
