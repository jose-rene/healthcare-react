<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayerRequest extends FormRequest
{
    public function rules()
    {
        return [
            'parent_id'                => [],
            'name'                     => ['required'],
            'abbreviation'             => [],
            'assessment_label'         => [],
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
            'payer_type_id'            => [],
            'per_request_average_high' => [],
            'per_request_average_low'  => [],
            'tat_default_time'         => [],
            'tat_lead_red'             => [],
            'tat_lead_yellow'          => [],
        ];
    }

    public function authorize()
    {
        return true;
    }
}
