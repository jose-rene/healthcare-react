<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestItemResource extends JsonResource
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
            'id'              => $this->uuid,
            'name'            => $this->name,
            'request_type_id' => $this->request_type_id,
            'details'         => $this->requestTypeDetails->pluck('name', 'id'),
        ];
    }
}
