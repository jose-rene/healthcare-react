<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestItemResource extends JsonResource
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
            'id'                   => $this->uuid,
            'name'                 => $this->name,
            'request_type_id'      => $this->request_type_id,
            'request_type_parents' => array_reverse($this->mapParents($this->requestType->ancestors, true)),
            'details'              => RequestTypeDetailResource::collection($this->requestTypeDetails), // ->pluck('name', 'id'),
        ];
    }

    /**
     * Recursively creates an array of parent ids.
     *
     * @param mixed $requestType
     * @return array
     */
    protected function mapParents($requestType, $reset = false)
    {
        static $parents = [];
        if (true === $reset) {
            $parents = [];
        }
        if (!$requestType) {
            return $parents;
        }
        $parents[] = $requestType['id'];
        if ($requestType['parent']) {
            return $this->mapParents($requestType['parent']);
        }

        return $parents;
    }
}
