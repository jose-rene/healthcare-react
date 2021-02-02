<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(type="object")
 */
class PhoneResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     *
     * @OA\Property(property="number", type="string", format="email", example="123-345-6789")
     * @OA\Property(property="is_primary", type="integer", example=1)
     */
    public function toArray($request)
    {
        return [
            'number'     => $this->number,
            'is_primary' => $this->is_primary,
        ];
    }
}
