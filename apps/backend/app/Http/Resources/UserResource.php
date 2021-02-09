<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

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
        // user type data
        $userTypeResource = [];
        if (!empty($this->user_type_name)) {
            $userTypeResourceName = 'App\\Http\\Resources\\UserType\\' . $this->user_type_name . 'Resource';
            $relation = Str::camel($this->user_type_name);
            if (null !== $this->{$relation}) {
                $userTypeResource = new $userTypeResourceName($this->{$relation});
            }
        }

        return [
            'id'          => $this->uuid,
            'user_type'   => $this->user_type_name,
            'name'        => $this->full_name,
            'first_name'  => $this->first_name,
            'middle_name' => $this->middle_name ?? '',
            'last_name'   => $this->last_name,
            'email'       => $this->email,
            'phones'      => $this->phones->count() ? new PhoneCollectionResource($this->phones) : [],
            'roles'       => new RolesResource($this->roles),
            $this->mergeWhen(!empty($userTypeResource), $userTypeResource),
        ];
    }
}
