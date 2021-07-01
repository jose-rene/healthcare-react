<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Bouncer;

class ClinicalServicesUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'clinical_type_id'        => ['bail', 'required', 'exists:clinical_types,id'],
            'clinical_user_status_id' => ['bail', 'required', 'exists:clinical_user_statuses,id'],
            'clinical_user_type_id'   => ['bail', 'required', 'exists:clinical_user_types,id'],
            'therapy_network_id'      => ['bail', 'exists:therapy_network_id, id'],
            'job_title'               => ['bail', 'min:1'],
            'date_hired'              => ['bail', 'min:1'],
            'first_name'              => ['bail', 'required', 'min:1'],
            'last_name'               => ['bail', 'required', 'min:1'],
            'email'                   => ['bail', 'required', 'email:rfc', 'unique:users'],
            'phone'                   => ['min:10'],
            'primary_role' => ['bail', 'required', function ($attribute, $value, $fail) {
                if (null === ($role = Bouncer::role()->firstWhere(['name' => $value]))) {
                    $fail('An invalid role was selected.');

                    return;
                }
                if ('Clinical Services' !== $role->domain) {
                    $fail(sprintf('The % role is not in the Clinical Services domain.', $role->title));
                }
            }],
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
            'member_number_ids.*' => 'The :input is not a valid member number type',
        ];
    }

    public function authorize()
    {
        return auth()->user()->can('create-payers');
    }
}
