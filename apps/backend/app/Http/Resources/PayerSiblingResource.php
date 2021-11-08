<?php

namespace App\Http\Resources;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayerSiblingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Same as Payer Resource without children that cause infinite recursion
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'                  => $this->uuid,
            'company_name'        => $this->name,
            'abbreviation'        => $this->abbreviation,
            'assessment_label'    => $this->assessment_label,
            'has_phi'             => $this->has_phi,
            'lines_of_business'   => LobResource::collection($this->lobs),
            'member_number_types' => PayerMemberNumberResource::collection($this->memberNumberTypes),
            // 'classifications'     => ClassificationResource::collection($this->classifications),
            // 'address'             => new AddressResource($this->mainAddress),
            // 'address_list'        => AddressResource::collection($this->addresses),
            // 'phone'               => new PhoneResource($this->mainPhone),
            // 'email'               => new EmailResource($this->mainEmail),
            // 'contacts'            => array_merge(PhoneContactResource::collection($this->phones)->toArray($request), EmailContactResource::collection($this->emails)->toArray($request)),
            // 'languages'           => Language::all()->map(fn ($lang) => ['id' => $lang['id'], 'name' => $lang['name']]),
            'avatar_url'          => route('payer.avatar.show', ['payer' => $this]),
            'company_category'    => $this->company_category,
            'category'            => $this->category,
        ];
    }
}
