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
            'request_item_id'  => ['required'],
            'document_type_id' => ['required'],
            'name'             => ['required'],
            'mime_type'        => ['required'],
            'file'             => ['required', 'file'],
        ];
    }
}