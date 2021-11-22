<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActivityRequest extends FormRequest
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
            'request_id'   => ['bail', 'required', 'exists:requests,uuid'],
            'parent_id'    => ['exists:activities,id'],
            'priority'     => ['bail', 'boolean'],
            'notify_admin' => ['bail', 'boolean'],
            'message'      => ['bail', 'min:2'],
        ];
    }
}
