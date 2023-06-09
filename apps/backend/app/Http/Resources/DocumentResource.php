<?php

namespace App\Http\Resources;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Document
 */
class DocumentResource extends JsonResource
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
            'id'                 => $this->uuid,
            'name'               => $this->name,
            'mime_type'          => $this->mime_type,
            'url'                => $this->url,
            'request_item_id'    => $this->requestItem->uuid ?? '',
            'request_item'       => $this->requestItem,
            'document_type_id'   => $this->document_type_id,
            'document_type'      => new RequestTypeResource($this->documentType),
            'document_type_name' => $this->documentType->name ?? '',
        ];
    }
}
