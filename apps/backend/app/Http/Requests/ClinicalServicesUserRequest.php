<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Bouncer;

class ClinicalServicesUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title'                => ['bail', 'min:1'],
            'first_name'           => ['bail', 'required', 'min:1'],
            'last_name'            => ['bail', 'required', 'min:1'],
            'notification_prefs'   => ['bail', 'required', 'min:1'],
            'notification_prefs.*' => ['bail', 'in:sms,mail'],
            'phone'                => ['min:10'],
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
            'notification_pref.*' => 'The :input is not a valid notification preference',
        ];
    }

    public function authorize()
    {
        // @note permissions for create user are checked in the user policy
        return auth()->check();
    }
}
