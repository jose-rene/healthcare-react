<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CompanyContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->user()->can('create-payers');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'contacts'         => ['bail', 'required', 'min:1'],
            'contacts.*'       => ['bail', 'required'],
            'contacts.*.type'  => ['bail', 'required'],
            'contacts.*.value' => ['bail', 'required'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'contacts.*.required'       => 'Contact information is required',
            'contacts.*.type.required'  => 'A contact type is required',
            'contacts.*.value.required' => 'An email or phone number is required',
        ];
    }
}
