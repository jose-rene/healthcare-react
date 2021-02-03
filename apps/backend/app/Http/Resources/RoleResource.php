<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(type="object")
 */
class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     *
     *  @OA\Property(property="name",type="name",example="admin")
     *  @OA\Property(property="level",type="integer",example=54)
     *  @OA\Property(property="title",type="string",example="Administrator")
     */
    public function toArray($request): array
    {
        return [
            'name'  => $this->name,
            'level' => $this->level,
            'title' => $this->title,
        ];
    }
}
