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
            'abbreviation'        => $this->abbreviation,
            'assessment_label'    => $this->assessment_label,
            'has_phi'             => $this->has_phi,
            'lines_of_business'   => LobResource::collection($this->lobs),
            'payers'              => self::collection($this->children),
            'member_number_types' => PayerMemberNumberResource::collection($this->memberNumberTypes),
            'request_types'       => RequestTypeResource::collection($this->requestTypes->whereNull('parent_id')),
            'address'             => new AddressResource($this->mainAddress),
            'phone'               => new PhoneResource($this->mainPhone),
            'email'               => new EmailResource($this->mainEmail),
            'contacts'            => array_merge(PhoneResource::collection($this->phones)->toArray($request), EmailResource::collection($this->emails)->toArray($request)),
            'languages'           => Language::all()->map(fn ($lang)           => ['id' => $lang['id'], 'name' => $lang['name']]),
            'avatar_url'          => route('payer.avatar.show', ['payer' => $this]),
            'company_category'    => $this->company_category,
            'category'            => $this->category,
        ];
    }
}
