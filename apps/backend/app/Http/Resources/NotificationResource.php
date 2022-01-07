<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class NotificationResource extends JsonResource
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
            'id'               => $this->id,
            'activity_id'      => $this->data['id'] ?? null,
            'request_id'       => $this->data['request_id'] ?? null,
            'message'          => $message = $this->data['message'] ?? "",
            'title'            => $this->data['title'] ?? Str::of($message)->words(5, ' ...'),
            'priority'         => empty($this->data['priority']) ? 1 : (int) $this->data['priority'],
            'human_read_at'    => $this->read_at ? (new Carbon($this->read_at))->diffForHumans() : null,
            'human_created_at' => (new Carbon($this->created_at))->diffForHumans(),
        ];
    }
}
