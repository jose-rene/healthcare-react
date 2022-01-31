<?php

namespace App\Http\Resources;

use App\Models\RequestFormSection;
use Arr;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RequestFormSection */
class CriticalFactorsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $answer_sections = $this->answer_data;
        $response        = [];

        foreach ($answer_sections as $section_name => $section) {
            if (!is_array($section)) {
                continue;
            }

            if (Arr::get($section, 'cf', false) !== true) {
                continue;
            }

            if (!isset($response[$section_name])) {
                $response[$section_name] = [];
            }

            $response[$section_name][] = $section;
        }

        return [
                'slug' => $this->section->slug,
                'name' => $this->section->name,
            ] + ['factors' => $response];
    }
}
