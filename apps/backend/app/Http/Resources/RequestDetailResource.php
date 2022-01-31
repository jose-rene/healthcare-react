<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 *
 * @mixin \App\Models\Request
 */
class RequestDetailResource extends JsonResource
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
            'reviewer'          => $this->reviewer ? new ReviewerResource($this->reviewer) : null,
            'status'            => $this->statusName,
            'status_id'         => (int)$this->request_status_id,
            'classification_id' => $this->classification_id ?? null,
            'member'            => new MemberDetailResource($this->member),
            'payer'             => new PayerDetailResource($this->payer),
            'member_verified'   => $this->member_verified,
            'request_date'      => $this->requested_at->format('m/d/Y'),
            'auth_number'       => $this->auth_number,
            'request_status_id' => $this->request_status_id,
            'request_type_id'   => $this->request_type_id,
            'created_at'        => $this->created_at->format('m/d/Y'),
            'received_date'     => $this->received_date->format('m/d/Y'),
            'called_date'       => $this->called_date ? $this->called_date->format('m/d/Y') : null,
            'appointment_date'  => $this->appointment_date ? $this->appointment_date->format('m/d/Y') : null,
            'due_at'            => $this->due_at ? $this->due_at->format('m/d/Y H:i:s') : '',
            'due_at_na'         => $this->due_at_na,
            'documents_na'      => $this->documents_na,
            'documents_reason'  => $this->documents_reason,
            'request_type_name' => $this->requestType->name ?? '',
            'codes'             => RelevantDiagnosesResource::collection($this->relevantDiagnoses),
            'request_items'     => RequestItemResource::collection($this->requestItems),
            'activities'        => ActivityResource::collection($this->activities),
            'documents'         => DocumentResource::collection($this->documents),
            'media'             => MediaResource::collection($this->media),
            'form'              => RequestFormSectionResource::collection($this->requestFormSections),
            'critical_factors'  => CriticalFactorsResource::collection($this->requestFormSections),
        ];
    }
}
