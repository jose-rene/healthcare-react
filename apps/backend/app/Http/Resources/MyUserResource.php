<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed name
 * @property mixed first_name
 * @property mixed middle_name
 * @property mixed last_name
 * @property mixed email
 * @property mixed dob
 * @property mixed roles
 */
class MyUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $abilities = $this->getAbilities();

        return [
            'full_name'    => $this->name,
            'first_name'   => $this->first_name,
            'middle_name'  => $this->middle_name,
            'last_name'    => $this->last_name,
            'email'        => $this->email,
            'dob'          => $this->dob,
            'user_type'    => $this->user_type_name,
            'roles'        => RoleResource::collection($this->roles),
            'primary_role' => $this->primary_role ?? $this->roles->first()->name ?? '',
            'abilities'    => $abilities->count() > 0 ? $abilities->map(fn ($item, $key) => $item['name']) : [],
        ];
    }
}
