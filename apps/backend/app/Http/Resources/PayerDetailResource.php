<?php

namespace App\Http\Resources;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayerDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        // for child company plan (payer) choices
        $siblings = $this->parent && $this->parent->children ? $this->parent->children : null;
        return [
            'id'                  => $this->uuid,
            'company_name'        => $this->name,
            'abbreviation'        => $this->abbreviation,
            'assessment_label'    => $this->assessment_label,
            'has_phi'             => $this->has_phi,
            'lines_of_business'   => LobResource::collection($this->lobs),
            'payers'              => PayerLobResource::collection($this->children),
            'siblings'            => $siblings ? PayerSiblingResource::collection($siblings) : [],
            'member_number_types' => PayerMemberNumberResource::collection($this->memberNumberTypes),
            'classifications'     => ClassificationResource::collection($this->classifications),
            // 'request_types'       => RequestTypeResource::collection($this->requestTypes->whereNull('parent_id')),
            'address'             => new AddressResource($this->mainAddress),
            'address_list'        => AddressResource::collection($this->addresses),
            'phone'               => new PhoneResource($this->mainPhone),
            'email'               => new EmailResource($this->mainEmail),
            'contacts'            => array_merge(PhoneContactResource::collection($this->phones)->toArray($request), EmailContactResource::collection($this->emails)->toArray($request)),
            'languages'           => Language::all()->map(fn ($lang) => ['id' => $lang['id'], 'name' => $lang['name']]),
            'avatar_url'          => route('payer.avatar.show', ['payer' => $this]),
            'company_category'    => $this->company_category,
            'category'            => $this->category,
        ];
    }
}
