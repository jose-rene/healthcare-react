<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
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
            'id'         => $this->uuid,
            'parent_id'  => $this->parent ? $this->parent->uuid : null,
            'date'       => Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('m/d/Y'),
            'priority'   => $this->priority,
            'message'    => $this->message,
            'type'       => $this->type,
            'activities' => $this->activities->count() ? self::Collection($this->activities) : null,
        ];
    }
}
