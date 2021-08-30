<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

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
        // user type data
        $userTypeResource = [];
        if (!empty($this->user_type_name)) {
            $userTypeResourceName = 'App\\Http\\Resources\\UserType\\' . $this->user_type_name . 'Resource';
            $relation = Str::camel($this->user_type_name);
            if (null !== ($userType = $this->{$relation}()->first())) {
                $userTypeResource = new $userTypeResourceName($userType);
            }
        }

        $abilities = $this->getAbilities();

        return [
            'title'              => $this->title,
            'full_name'          => $this->name,
            'first_name'         => $this->first_name,
            'middle_name'        => $this->middle_name,
            'last_name'          => $this->last_name,
            'email'              => $this->email,
            'phone_primary'      => $this->main_phone ? $this->main_phone->number : '',
            'dob'                => $this->dob,
            'user_type'          => $this->user_type_name,
            'roles'              => RoleResource::collection($this->roles),
            'primary_role'       => $this->primary_role ?? $this->roles->first()->name ?? '',
            'abilities'          => $abilities->count() > 0 ? $abilities->map(fn ($item, $key) => $item['name']) : [],
            'reset_password'     => (bool) $this->reset_password,
            'avatar_url'         => $this->avatar_url,
            'notification_prefs' => $this->notification_prefs ?? [],
            $this->mergeWhen(!empty($userTypeResource), $userTypeResource),
        ];
    }
}
