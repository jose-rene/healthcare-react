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
            'considerations'                   => ['bail', 'required', 'array'],
            'considerations.*.request_item'    => ['required', 'exists:request_items,uuid'],
            'considerations.*.request_type_id' => ['bail', 'required', 'exists:request_types,id'],
            'considerations.*.classifications' => ['bail', 'required', 'exists:classifications,id'],
            'considerations.*.summary'         => ['bail', 'required', 'min:2'],
            'considerations.*.is_default'      => ['bail', 'boolean'],
            'considerations.*.is_recommended'  => ['bail', 'boolean', 'required_if:is_default,true'],
        ];
    }
}
