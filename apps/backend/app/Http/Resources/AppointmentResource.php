<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'               => $this->id,
            'called_at'        => $this->called_at ? $this->called_at->format('m/d/Y') : null,
            'is_scheduled'     => $this->is_scheduled,
            'is_cancelled'     => $this->is_cancelled,
            'is_reschedule'    => $this->is_reschedule,
            'appointment_date' => $this->appointment_date ? $this->appointment_date->format('m/d/Y') : null,
            'start_time'       => $this->start_time,
            'end_time'         => $this->end_time,
            'reason'           => $this->reason,
        ];
    }
}
