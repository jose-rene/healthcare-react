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
        $dateTime = Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at);

        return [
            'id'         => $this->uuid,
            'parent_id'  => $this->parent ? $this->parent->uuid : null,
            'user_id'    => $this->user_id,
            'date'       => $dateTime->format('m/d/Y'),
            'datetime'   => $dateTime->format('m/d/Y H:i:s'),
            'priority'   => $this->priority,
            'message'    => $this->message,
            'type'       => $this->activityType ? $this->activityType->slug : null,
            'activities' => $this->activities->count() ? self::Collection($this->activities) : null,
        ];
    }
}
