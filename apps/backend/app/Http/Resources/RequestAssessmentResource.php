<?php

namespace App\Http\Resources;

use App\Models\Assessment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\Tags\Tag;

class RequestAssessmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $assessment = Assessment::firstWhere('name', 'Standard Assessment');

        return [
            'id'                => $this->uuid,
            'assessment_form'   => $assessment ? new AssessmentFormResource($assessment) : ['name' => 'N/A', 'forms' => []],
            'clinician'         => $this->clinician ? ['id' => $this->clinician->uuid, 'name' => $this->clinician->full_name] : null,
            'reviewer'          => $this->reviewer ? ['id' => $this->reviewer->uuid, 'name' => $this->reviewer->full_name] : null,
            'status'            => $this->statusName,
            'status_id'         => (int) $this->request_status_id,
            'member'            => new MemberDetailResource($this->member),
            // 'payer'             => new PayerResource($this->payer),
            'member_verified'   => $this->member_verified,
            'request_date'      => $this->requested_at->format('m/d/Y'),
            'called_date'       => $this->called_date ? $this->called_date->format('m/d/Y') : null,
            'auth_number'       => $this->auth_number,
            'request_status_id' => $this->request_status_id,
            'request_items'     => RequestItemResource::collection($this->requestItems),
            'created_at'        => $this->created_at->format('m/d/Y'),
            'received_date'     => $this->received_date->format('m/d/Y'),
            'called_date'       => $this->called_date ? $this->called_date->format('m/d/Y') : null,
            'appointment_date'  => $this->appointment_date ? $this->appointment_date->format('m/d/Y') : null,
            'appt_window'       => $this->appointment_window,
            'cancelled_date'    => $this->cancelled_date ? $this->cancelled_date->format('m/d/Y') : null,
            'on_hold_date'      => $this->on_hold_date ? $this->on_hold_date->format('m/d/Y') : null,
            'appointment'       => $this->appointments ? new AppointmentResource($this->appointments->first()) : null,
            'due_at'            => $this->due_at ? $this->due_at->format('m/d/Y H:i:s') : '',
            'due_at_na'         => $this->due_at_na,
            'request_type_name' => $this->requestType->name ?? '',
            'codes'             => RelevantDiagnosesResource::collection($this->relevantDiagnoses),
            'request_items'     => RequestItemResource::collection($this->requestItems),
            'activities'        => ActivityResource::collection($this->activities),
            'documents'         => DocumentResource::collection($this->documents),
            'media'             => MediaResource::collection($this->media),
            'appt_reasons'      => [
                'Willing to schedule outside of turnaround time',
                'Member can\'t/won\'t schedule',
                'Number not in service or incorrect',
                'Left message',
                'No answer',
                'No voicemail',
                'Can\'t leave message',
                'Other',
            ],
            'media_tags'         => Tag::getWithType('media')->map(fn($item) => $item['name']),
        ];
    }
}
