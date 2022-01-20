<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NarrativeReportTemplateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'     => [],
            'template' => [],
            'styles'   => [],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
