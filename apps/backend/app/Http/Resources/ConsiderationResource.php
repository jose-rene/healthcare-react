<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ConsiderationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $classification = $this->requestType->topClassification;

        return [
            'id'                  => $this->id,
            'request_type_id'     => $this->request_type_id, // new RequestTypeResource($this->requestType),
            'all_request_types'   => collect($this->requestType->all_parents)->push($this->request_type_id),
            'name'                => $this->requestType->name,
            'classification'      => $classification ? $classification->id : '',
            'classification_name' => $classification ? $classification->name : '',
            'summary'             => $this->summary,
            'is_default'          => $this->is_default,
        ];
    }
}
