<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Icd10CodeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // @note permissions for lookup member search are checked in the Icd10Code policy
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
            'term' => ['required', 'regex:/^[a-z]/i'],
        ];
    }

    public function messages()
    {
        return [
            'term.required' => 'Please enter an ICD-10 Code or Description.',
            'term.regex'    => 'ICD-10 Code or Description must start with a letter.',
        ];
    }
}
