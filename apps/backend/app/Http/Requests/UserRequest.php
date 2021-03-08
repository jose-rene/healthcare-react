<?php

namespace App\Http\Requests;

use App\Models\User;
use Bouncer;
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
        // @note permissions for create user are checked in the user policy
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
            'first_name'        => ['bail', 'required', 'min:1'],
            'last_name'         => ['bail', 'required', 'min:1'],
            'phone'             => ['min:10'],
            'job_title'         => ['min:2'],
            'can_view_invoices' => ['boolean', 'nullable'],
            'can_view_reports'  => ['boolean', 'nullable'],
            'can_create_users'  => ['boolean', 'nullable'],
            'user_type'         => ['bail', 'required_without'], // this is always based on role
            'primary_role'      => ['bail', function ($attribute, $value, $fail) {
                if (null === ($role = Bouncer::role()->firstWhere(['name' => $value]))) {
                    $fail('An invalid role update was selected.');

                    return;
                }
                // check if the domain matches
                if (!auth()->user()->can('apply-any-role') && $role->domain !== auth()->user()->user_type_domain) {
                    $fail('You do not have permission to add this role.');
                }
                // check the role is in the users roles, allow user to switch to a new role
                /*if (!$this->user->roles->contains('name', $value)) {
                    $fail('The user does not have this role.');

                    return;
                }*/
            }],
        ];

        // add rules for create user route
        if ('user.store' === $this->route()->getName()) { // 'POST' === $this->method()
            $rules = array_replace($rules, [
                'email'        => ['bail', 'required', 'email:rfc', 'unique:users'],
                'password'     => ['bail', 'min:8', 'regex:' . config('rules.patterns.password')],
                'primary_role' => ['bail', 'required', function ($attribute, $value, $fail) {
                    if (null === ($role = Bouncer::role()->firstWhere(['name' => $value]))) {
                        $fail('An invalid role was selected.');

                        return;
                    }
                    // check if the domain matches
                    if (!auth()->user()->can('apply-any-role') && $role->domain !== auth()->user()->user_type_domain) {
                        $fail('You do not have permission to add this role.');
                    }
                }],
            ]);
        }

        return $rules;
    }

    /**
     * Handle a passed validation attempt. This doesn't work, use required_without and $request when determining a value based on context.
     *
     * @return void
     */
    protected function passedValidation()
    {
        // dd($this->filled('primary_role'), $this->primary_role, Bouncer::role()->firstWhere(['name' => $this->primary_role])->domain, User::mapTypeForDomain(Bouncer::role()->firstWhere(['name' => $this->primary_role])->domain));
        if ($this->filled('primary_role')) {
            // @note this will exist when validated
            $userType = User::mapTypeForDomain(Bouncer::role()->firstWhere(['name' => $this->primary_role])->domain);
            $this->merge(['user_type' => $userType]);
        }
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['errors' => $validator->errors()], 422));
    }
}
