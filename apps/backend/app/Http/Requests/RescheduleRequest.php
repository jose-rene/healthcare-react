<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RescheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->user()->isA('field_clinician') || auth()->user()->can('schedule-appointments');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'request_id'       => ['bail', 'required', 'exists:requests,uuid'],
            'called_at'        => ['bail', 'required', 'date_format:Y-m-d'],
            'is_cancelled'     => ['bail', 'required', 'boolean'],
            'appointment_date' => ['date_format:Y-m-d'],
            'start_time'       => ['bail', 'required_with:appointment_date'],
            'end_time'         => ['bail', 'required_with:appointment_date'],
            'reason'           => ['bail', 'required'],
        ];
    }

    public function messages()
    {
        return [
            'called_at.required'             => 'The date called is required.',
            'is_cancelled.required'  => 'Reschedule or Cancel is required.',
        ];
    }
}
