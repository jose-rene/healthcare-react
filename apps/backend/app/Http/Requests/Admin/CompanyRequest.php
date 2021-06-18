<?php

namespace App\Http\Requests\Admin;

use App\Models\Payer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyRequest extends FormRequest
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
        $payerCategoryIds = collect(Payer::getCategories())->map(fn ($cat, $i) => $i);

        return [
            'parent_id'      => [],
            'name'           => ['required', 'min:2'],
            'category'       => ['required', 'integer', 'in:1,3'], // payer or therapy network
            'payer_category' => ['required_if:category,1', Rule::in($payerCategoryIds)],
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
            'category.*' => 'The selected company type is not currently supported',
        ];
    }
}
