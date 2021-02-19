<?php

namespace App\Http\Resources\UserType;

use App\Http\Resources\PayerResource;
use Illuminate\Http\Resources\Json\JsonResource;

class HealthPlanUserResource extends JsonResource
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
            'payer' => new PayerResource($this->payer),
        ];
    }
}
