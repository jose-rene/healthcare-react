<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PayerResource extends JsonResource
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
            'id'                => $this->uuid,
            'company_name'      => $this->name,
            'lines_of_business' => LobResource::collection($this->lobs),
            'payers'            => self::collection($this->children),
        ];
    }
}
