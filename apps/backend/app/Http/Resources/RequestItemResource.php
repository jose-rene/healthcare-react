<?php

namespace App\Http\Resources;

use App\Models\RequestType;
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
        // the parent request types
        $parents = $this->requestType ? $this->requestType->allParents : null;
        // the related classifcation, will be related to the top parent
        $classification = $this->requestType ? $this->requestType->topClassification : null;

        return [
            'id'                   => $this->uuid,
            'considerations'       => ConsiderationResource::collection($this->defaultConsiderations),
            'vendor_price'         => $this->vendor_price,
            'name'                 => $this->name,
            'request_type_id'      => $this->request_type_id,
            'request_type_parents' => $parents,
            'details'              => RequestTypeDetailResource::collection($this->requestTypeDetails),
            'classification'       => $classification ? $classification->id : "",
            'classification_name'  => $classification ? $classification->name : "",
            // ->pluck('name', 'id'),
        ];
    }
}
