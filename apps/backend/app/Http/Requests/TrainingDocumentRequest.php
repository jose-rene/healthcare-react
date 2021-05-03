<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingDocumentRequest extends FormRequest
{
    public function rules()
    {
        return [
            'training_document_id' => [''],
            'payer_id'             => [''],
            'name'                 => [''],
            'mime_type'            => [''],
            'file'                 => ['file'],
        ];
    }

    public function authorize()
    {
        return true;
    }
}
