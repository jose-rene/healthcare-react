<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->user()->can('create-payers');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'address_type_id' => ['bail', 'required', 'exists:address_types,id'],
            'address_1'       => ['bail', 'required', 'min:1'],
            'address_2'       => ['bail', 'min:1'],
            'city'            => ['bail', 'required', 'min:1'],
            'state'           => ['bail', 'required', 'min:2'],
            'county'          => ['bail', 'min:2'],
            'postal_code'     => ['bail', 'required', 'min:5'],
            'is_primary'      => ['bail', 'boolean'],
        ];
    }
}
