<?php

namespace App\Http\Resources;

use App\Models\NarrativeReportTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NarrativeReportTemplate */
class NarrativeReportTemplateResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'slug'      => $this->slug,
            'template'  => $this->template,
            'test_json' => $this->test_json,
            'styles'    => $this->styles,
        ];
    }
}
