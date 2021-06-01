<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
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
            'id'                => $this->uuid,
            'member'            => new MemberResource($this->member),
            'payer'             => new PayerResource($this->payer),
            'member_verified'   => $this->member_verified,
            'request_date'      => $this->requested_at->format('m/d/Y'),
            'auth_number'       => $this->auth_number,
            'request_status_id' => $this->request_status_id,
            'request_type_id'   => $this->request_type_id,
            'created_at'        => $this->created_at->format('m/d/Y'),
            'due_at'            => $this->due_at ? $this->due_at->format('m/d/Y H:i:s') : '',
            'request_type_name' => $this->requestType->name ?? '',
            'codes'             => RelevantDiagnosesResource::collection($this->relevantDiagnoses),
            'request_items'     => RequestItemResource::collection($this->requestItems),
            'activities'        => ActivityResource::collection($this->activities),
        ];
    }
}
