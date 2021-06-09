<?php

namespace App\Http\Resources;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TherapyNetworkResource extends JsonResource
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
            'id'               => $this->uuid,
            'company_name'     => $this->name,
            'company_category' => $this->company_category,
        ];
    }
}
