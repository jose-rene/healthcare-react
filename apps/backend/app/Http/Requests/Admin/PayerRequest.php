<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PayerRequest extends FormRequest
{
    public function rules()
    {
        return [
            'parent_id'                => ['bail', 'exists:payers, id'],
            'name'                     => ['bail', 'min:1'],
            'category_id'              => ['bail', 'min:1'],
            'abbreviation'             => ['bail', 'min:1'],
            'assessment_label'         => ['bail', 'min:1'],
            'member_number_types.*'    => ['bail', 'exists:member_number_types,id'],
            'billing_document_type'    => [],
            'billing_frequency_id'     => [],
            'coupa_business_name'      => [],
            'coupa_cxml_template'      => [],
            'coupa_identity'           => [],
            'coupa_shared_secret'      => [],
            'coupa_url'                => [],
            'criteria'                 => [],
            'email_security_option_id' => [],
            'is_test'                  => ['boolean'],
            'has_phi'                  => ['boolean'],
            'payer_type_id'            => [],
            'per_request_average_high' => [],
            'per_request_average_low'  => [],
            'tat_default_time'         => [],
            'tat_lead_red'             => [],
            'tat_lead_yellow'          => [],
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
