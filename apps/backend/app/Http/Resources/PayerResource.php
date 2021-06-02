<?php

namespace App\Http\Resources;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'                  => $this->uuid,
            'company_name'        => $this->name,
            'lines_of_business'   => LobResource::collection($this->lobs),
            'payers'              => self::collection($this->children),
            'member_number_types' => PayerMemberNumberResource::collection($this->memberNumberTypes),
            'request_types'       => RequestTypeResource::collection($this->requestTypes->whereNull('parent_id')),
            'address'             => new AddressResource($this->mainAddress),
            'phone'               => new PhoneResource($this->mainPhone),
            'languages'           => Language::all()->map(fn($lang) => ['id' => $lang['id'], 'name' => $lang['name']]),
            'avatar_url'          => route('payer.avatar.show', ['payer' => $this]),
        ];
    }
}
