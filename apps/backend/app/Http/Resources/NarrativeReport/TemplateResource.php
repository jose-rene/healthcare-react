<?php

namespace App\Http\Resources\NarrativeReport;

use App\Models\NarrativeReportTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin NarrativeReportTemplate
 */
class TemplateResource extends JsonResource
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
            'id'       => $this->id,
            'slug'     => $this->slug,
            'template' => $this->template,
            'name'     => $this->name,
        ];
    }
}
