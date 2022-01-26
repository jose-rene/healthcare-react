<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Request
 */
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
            'clinician'         => $this->clinician ? [
                'id'   => $this->clinician->uuid,
                'name' => $this->clinician->full_name,
            ] : null,
            'reviewer'          => $this->reviewer ? [
                'id'   => $this->reviewer->uuid,
                'name' => $this->reviewer->full_name,
            ] : null,
            'status'            => $this->statusName,
            'status_id'         => (int)$this->request_status_id,
            'member'            => new MemberResource($this->member),
            'payer'             => new PayerResource($this->payer),
            'hp_user'           => $this->when($this->hpUser, new MemberResource($this->hpUser)),
            'member_verified'   => $this->member_verified,
            'request_date'      => $this->requested_at->format('m/d/Y'),
            'auth_number'       => $this->auth_number,
            'request_status_id' => $this->request_status_id,
            'request_type_id'   => $this->request_type_id,
            'created_at'        => $this->created_at->format('m/d/Y'),
            'received_date'     => $this->received_date->format('m/d/Y'),
            'assessed_date'     => optional($this->assessed_date)->format('m/d/Y'),
            'due_at'            => $this->due_at ? $this->due_at->format('m/d/Y H:i:s') : '',
            'due_at_na'         => $this->due_at_na,
            'request_type_name' => $this->requestType->name ?? '',
            'codes'             => RelevantDiagnosesResource::collection($this->relevantDiagnoses),
            'request_items'     => RequestItemResource::collection($this->requestItems),
            'activities'        => ActivityResource::collection($this->activities),
            'documents'         => DocumentResource::collection($this->documents),
        ];
    }
}
