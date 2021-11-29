<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'document_type_id' => ['required', 'exists:document_types,id'],
            'name'             => ['required', 'min:2'],
            'mime_type'        => ['required'],
            'file'             => ['required', 'file'],
            'position'         => ['required_if:document_type_id,2'], // media
            'description'      => ['min:2'],
            'tag'              => ['min:2'],
        ];
    }
}
