<?php

namespace App\Http\Resources;

use Arr;
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
        $critical_factors = [];
        $form             = [];

        $form_sections = $this->requestFormSections;


        foreach ($form_sections as $form_section) {
            $section_details = $form_section->section;
            $form_name       = $section_details->slug;

            Arr::set($form, $form_name, $form_section->answer_data);

            foreach ($form_section->answer_data as $field_name => $answer) {
                if (!is_array($answer)) {
                    continue;
                }

                $found_repeater = false;

                // TODO :: account for repeater groups. Right now it won't
                if (is_array($answer) && is_numeric(key($answer))) {
                    foreach ($answer as $repeater_index => $repeater_answer) {
                        $found_repeater = true;

                        /**
                         * This is not a repeater group
                         */
                        if (Arr::get($repeater_answer, 'cf', false) !== true) {
                            continue;
                        }

                        if (!isset($critical_factors[$form_name][$field_name])) {
                            Arr::set($critical_factors, "{$form_name}.{$field_name}", []);
                        }

                        $critical_factors[$form_name][$field_name][$repeater_index][] = $repeater_answer;
                    }
                }

                if (!$found_repeater) {
                    /**
                     * This is not a repeater group
                     */
                    if (Arr::get($answer, 'cf', false) !== true) {
                        continue;
                    }

                    if (!isset($critical_factors[$form_name][$field_name])) {
                        Arr::set($critical_factors, "{$form_name}.{$field_name}", []);
                    }

                    $critical_factors[$form_name][$field_name][] = $answer;
                }
            }
        }

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
            'form'              => $form,
            'critical_factors'  => $critical_factors,
        ];
    }
}
