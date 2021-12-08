<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
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
            'id'          => $this->uuid,
            'name'        => $this->name,
            'mime_type'   => $this->mime_type,
            'position'    => $this->position,
            'url'         => $this->url,
            'thumbnail'   => $this->thumbnail_url,
            'comments'    => $this->comments ?? '',
            'tags'        => $this->tags ? $this->tags->map(fn($tag) => $tag->name) : null,
        ];
    }
}
