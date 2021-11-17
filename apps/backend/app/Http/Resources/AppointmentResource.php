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
            'called_at'        => $this->called_at->format('m/d/Y'),
            'is_scheduled'     => $this->is_scheduled,
            'appointment_date' => $this->appointment_date ? $this->appointment_date->format('m/d/Y') : null,
            'reason'           => $this->reason,
        ];
    }
}