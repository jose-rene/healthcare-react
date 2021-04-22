<?php

namespace App\Http\Resources;

use App\Models\RequestType;
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
        // @todo set up payer request type relationship
        return [
            'id'                  => $this->uuid,
            'company_name'        => $this->name,
            'lines_of_business'   => LobResource::collection($this->lobs),
            'payers'              => self::collection($this->children),
            'member_number_types' => PayerMemberNumberResource::collection($this->memberNumberTypes),
            'request_types'       => RequestTypeResource::collection($this->requestTypes->whereNull('parent_id')),
        ];
    }
}
