<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(type="object")
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     *
     *  @OA\Property(property="id", type="string", format="uuid")
     *  @OA\Property(property="email", type="string", format="email", example="user1@mail.com")
     *  @OA\Property(property="first_name", type="string", format="string", example="Peter")
     *  @OA\Property(property="last_name", type="string", format="string", example="Griffin")
     *  @OA\Property(property="middle_name", type="string", format="string", example="Igor")
     *  @OA\Property(
     *    property="phones",
     *    type="array",
     *    @OA\Items(ref="#/components/schemas/PhoneResource"),
     *  )
     *  @OA\Property(
     *    property="roles",
     *    type="array",
     *    @OA\Items(ref="#/components/schemas/RoleResource"),
     *  )
     */
    public function toArray($request)
    {
        return [
            'id'          => $this->uuid,
            'name'        => $this->full_name,
            'first_name'  => $this->first_name,
            'middle_name' => $this->middle_name ?? '',
            'last_name'   => $this->last_name,
            'email'       => $this->email,
            'phones'      => $this->phones->count() ? new PhoneCollectionResource($this->phones) : [],
            'roles'       => RoleResource::collection($this->roles),
        ];
    }
}
