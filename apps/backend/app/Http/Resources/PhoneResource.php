<?php

namespace App\Http\Resources;

use App\Models\Phone;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Phone
 * @OA\Schema(type="object")
 */
class PhoneResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     *
     * @OA\Property(property="number", type="string", format="phone", example="123-345-6789")
     * @OA\Property(property="is_primary", type="integer", example=1)
     */
    public function toArray($request)
    {
        return [
            'id'          => $this->uuid,
            'number'      => $this->number,
            'is_primary'  => $this->is_primary,
            'description' => $this->contact_type,
        ];
    }
}
