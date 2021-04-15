<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
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
        $phone   = $this->phones->sortByDesc('is_primary')->first();
        $email   = $this->emails->sortByDesc('is_primary')->first();
        $lob     = $this->lob;
        if ($this->payer && $this->lob) {
            $lob = $this->payer->lobs->filter(fn ($item) => $item->id == $this->lob->id)->first();
        }
        // @todo add relationship fields when the db tables are made
        return [
            'id'            => $this->uuid,
            'gender'        => $this->gender,
            'title'         => $this->name_title,
            'first_name'    => $this->first_name,
            'last_name'     => $this->last_name,
            'member_number' => $this->member_number,
            'payer'         => $this->payer ? new PayerResource($this->payer) : null,
            'lob'           => $this->lob ? new LobResource($this->lob) : null,
            'dob'           => Carbon::parse($this->dob)->format('m/d/Y'),
            'address'       => new AddressResource($address),
            'phone'         => new PhoneResource($this->mainPhone),
            'email'         => new EmailResource($this->mainEmail),
        ];
    }
}
