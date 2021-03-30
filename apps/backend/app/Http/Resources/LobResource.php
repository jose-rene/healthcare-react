<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LobResource extends JsonResource
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
            'id'                => $this->id,
            'name'              => $this->name,
            'alias'             => $this->pivot->alias_name,
            'is_tat_enabled'    => $this->pivot->is_tat_enabled,
            'is_tat_default_na' => $this->pivot->is_tat_default_na,
            'is_tat_required'   => $this->pivot->is_tat_required,
        ];
    }
}
