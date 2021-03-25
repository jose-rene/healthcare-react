<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class MemberLookupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // @note permissions for lookup member search are checked in the member policy
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
            'first_name' => ['bail', 'required', 'min:1'],
            'last_name'  => ['bail', 'required', 'min:1'],
            'dob'        => ['bail', 'required', 'date_format:Y-m-d', 'before:today'],
        ];
    }

    public function messages()
    {
        return [
            'dob.before' => 'The date of birth must be a date before today.'
        ];
    }

    /**
     * Override failedValidation to give 422 response for frontend.
     *
     * @return void
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['errors' => $validator->errors()], 422));
    }
}
