<?php

namespace App\Http\Resources;

use App\Models\Consideration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Consideration
 */
class ConsiderationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $classification = $this->requestType ? $this->requestType->topClassification : null;

        return [
            'id'                  => $this->id,
            'request_type_id'     => $this->request_type_id, // new RequestTypeResource($this->requestType),
            'all_request_types'   => $this->requestType ? collect($this->requestType->all_parents)->push((int)$this->request_type_id) : [],
            'name'                => $this->requestType ? $this->requestType->name : '',
            'request_type_name'   => $this->requestType ? $this->requestType->name : '',
            'classification'      => $classification ? $classification->id : '',
            'classification_name' => $classification ? $classification->name : '',
            'summary'             => $this->summary,
            'is_default'          => $this->is_default,
            'is_recommended'      => $this->is_recommended,
            'hcpcs'               => $this->hcpcs,
        ];
    }
}
