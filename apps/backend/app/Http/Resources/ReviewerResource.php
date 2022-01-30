<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class ReviewerResource extends JsonResource
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
            'id'    => $this->uuid,
            'name'  => $this->name,
            'email' => $this->email,
            'phone' => new PhoneResource($this->mainPhone),
        ];
    }
}
