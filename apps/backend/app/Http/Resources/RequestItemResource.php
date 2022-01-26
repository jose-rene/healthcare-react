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
        $ancestors = $this->requestType && $this->requestType->ancestors ? $this->mapParents($this->requestType->ancestors) : null;
        $parents = $this->requestType && $this->requestType->ancestors ? collect(array_reverse($ancestors, true)) : null;
        // the related classification, will be related to the top parent
        $classification = $this->requestType ? $this->requestType->topClassification : null;

        return [
            'id'                   => $this->uuid,
            'considerations'       => ConsiderationResource::collection($this->defaultConsiderations()),
            'vendor_price'         => $this->vendor_price,
            'name'                 => $this->name,
            'full_name'            => $parents ? $parents->map(fn($item) => $item['name'])->prepend($this->name)->join(' > ') : null,     
            'request_type_id'      => (int) $this->request_type_id,
            'request_type_parents' => $parents ? $parents->map(fn($item) => $item['id']) : null,
            'details'              => RequestTypeDetailResource::collection($this->requestTypeDetails),
            'classification'       => $classification ? $classification->id : "",
            'classification_name'  => $classification ? $classification->name : "",
            'summary'              => $this->clinician_summary,
            // ->pluck('name', 'id'),
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
        $parents[] = ['id' => $requestType['id'], 'name' => $requestType['name']];
        if ($requestType['parent']) {
            return $this->mapParents($requestType['parent']);
        }

        return $parents;
    }
}
