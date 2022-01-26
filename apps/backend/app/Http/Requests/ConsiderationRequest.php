<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsiderationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
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
            'considerations'                     => ['bail', 'required', 'array'],
            'considerations.*.id'                => ['required_if:is_default,true'],
            'considerations.*.request_item'      => ['required', 'exists:request_items,uuid'],
            // 'considerations.*.request_type_id' => ['bail', 'required_if:is_default,false', 'exists:request_types,id'],
            'considerations.*.classification_id' => ['bail', 'required', 'exists:classifications,id'],
            'considerations.*.is_default'        => ['bail', 'boolean'],
            'considerations.*.is_recommended'    => ['bail', 'required_if:is_default,true', 'boolean'],
            'summary'                            => ['bail', 'required', 'min:2'],
        ];
    }

    public function messages()
    {
        return [
            'considerations.*.request_type_id.required_unless' => 'Request Type is required',
            'considerations.*.request_type_id.exists' => 'Request Type not found',
            'considerations.*.is_recommended.boolean' => 'Select yes/no that the consideration is recommended',
            'considerations.*.is_recommended.required_if' => 'Select yes/no that the consideration is recommended',
            'summary.required' => 'Summary is required',
        ];
    }
}
