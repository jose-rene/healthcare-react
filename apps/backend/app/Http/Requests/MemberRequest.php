<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class MemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // @note permissions for create user are checked in the member policy
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'gender'           => ['bail', 'required', 'min:1'],
            'title'            => ['bail', 'required', 'min:1'],
            'first_name'       => ['bail', 'required', 'min:1'],
            'last_name'        => ['bail', 'required', 'min:1'],
            'dob'              => ['bail', 'required', 'date_format:Y-m-d', 'before:today'],
            'plan'             => ['bail', 'required', 'exists:payers,uuid'],
            'member_number'    => ['bail', 'required', 'min:1'],
            'member_id_type'   => ['bail', 'required', 'min:1'],
            'line_of_business' => ['bail', 'required', 'exists:lob_payer,id'],
            'language'         => ['bail', 'required', 'min:1'],
            'address_1'        => ['bail', 'required', 'min:1'],
            'address_2'        => ['bail', 'min:1'],
            'city'             => ['bail', 'required', 'min:1'],
            'state'            => ['bail', 'required', 'min:2'],
            'postal_code'      => ['bail', 'required', 'min:5'],
            'county'           => ['bail', 'required', 'min:1'],
            'contacts'         => ['bail', 'required', 'min:1'],
            'contacts.*'       => ['bail', 'required'],
            // "contacts.*.email_phone" => "required_if:object.*.type,".implode(",",range(0,18))."|min:5"
        ];

        if ('api.member.update' === $this->route()->getName()) {
            // remove required from rules for updating
            $rules = array_map(function ($item) {
                return array_filter($item, fn ($rule) => 'required' !== $rule);
            }, $rules);
            // if the phone is to be updated
            $rules['phone'] = ['bail', 'min:7'];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'dob.before' => 'The date of birth must be a date before today.',
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
