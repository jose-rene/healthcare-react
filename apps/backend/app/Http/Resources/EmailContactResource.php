<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailContactResource extends JsonResource
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
            'id'          => $this->uuid,
            'type'        => 'email',
            'contact'     => $this->email,
            'is_primary'  => $this->is_primary,
            'description' => $this->contact_type,
        ];
    }
}
