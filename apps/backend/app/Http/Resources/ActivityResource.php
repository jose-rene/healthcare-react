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
            'id'       => $this->uuid,
            'date'     => Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('m/d/Y'),
            'message'  => $this->message,
            'type'     => $this->type,
            'children' => $this->children->count() ? new ActivityResourceCollection($this->children) : null,
        ];
    }
}
