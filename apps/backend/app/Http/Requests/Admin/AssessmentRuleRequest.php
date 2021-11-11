<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AssessmentRuleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->user()->can('work-gryphon');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'              => ['required', 'min:2'],
            'assessment_id'     => ['required', 'exists:assessments,id'],
            'payer_id'          => ['exists:payers,id,category_id,1'],
            'classification_id' => ['exists:classifications,id'],
            'request_type_id'   => ['exists:request_types,id'],
            'hcpc_id'           => ['exists:hcpcs,id'],
        ];
    }
}
