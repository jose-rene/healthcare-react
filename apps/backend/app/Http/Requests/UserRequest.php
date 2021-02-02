<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // @todo add check for permissions to add users
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
            'first_name' => ['bail', 'required', 'min:1'],
            'last_name'  => ['bail', 'required', 'min:1'],
            'phone'      => ['min:10'],
        ];

        // add rules for create user route
        if ('user.store' === $this->route()->getName()) { // 'POST' === $this->method()
            $rules += [
                'email'    => ['bail', 'required', 'email:rfc', 'unique:users'],
                'password' => ['bail', 'required', 'min:8', 'regex:/[a-zA-Z 0-9!_:~#@\.\,\(\)\{\}\[\]\+\-\$]/'],
            ];
        }

        return $rules;
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['errors' => $validator->errors()], 422));
    }
}
