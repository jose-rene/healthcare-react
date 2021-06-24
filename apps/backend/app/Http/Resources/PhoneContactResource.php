<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(type="object")
 */
class PhoneContactResource extends JsonResource
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
            'type'        => 'phone',
            'contact'     => $this->number,
            'is_primary'  => $this->is_primary,
            'description' => $this->contact_type,
        ];
    }
}
