<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(type="object")
 */
class UserListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
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
        $primaryRole = $this->roles()->where(['name' => $this->primary_role])->first();

        return [
            'id'                 => $this->uuid,
            'title'              => $this->title,
            'user_type'          => $this->user_type_name,
            'name'               => $this->full_name,
            'first_name'         => $this->first_name,
            'middle_name'        => $this->middle_name ?? '',
            'last_name'          => $this->last_name,
            'email'              => $this->email,
            //'phones'             => ($phoneCount = $this->phones->count()) ? new PhoneCollectionResource($this->phones) : [],
            'phone_primary'      => $this->main_phone ? $this->main_phone->number : '',
            //'address'            => new AddressResource($this->address),
            'primary_role'       => $this->primary_role,
            'primary_role_title' => $primaryRole ? $primaryRole->title : '',
            //'roles'              => $roles,
            //'abilities'          => $abilities->count() > 0 ? $abilities->map(fn ($item, $key) => $item['name']) : [],
            'two_factor_options' => $this->two_factor_options,
            'notification_prefs' => $this->notification_prefs ?? [],
        ];
    }
}
