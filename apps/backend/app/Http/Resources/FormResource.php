<?php

namespace App\Http\Resources;

use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Form
 */
class FormResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $revisions = $this->revisionHistory()
            ->where('key', 'fields')
            ->select('id', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return [
            'id'          => $this->id,
            'slug'        => $this->slug,
            'name'        => $this->name,
            'description' => $this->description,
            'fields'      => $this->fields,
            'updated_at'  => $this->updated_at->format('m/d/Y H:i:s'),
            'revisions'   => $revisions,
        ];
    }
}
