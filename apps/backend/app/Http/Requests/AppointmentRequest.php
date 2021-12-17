<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Bouncer;

class AppointmentRequest extends FormRequest
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
            'is_scheduled'     => ['bail', 'required', 'boolean'],
            'appointment_date' => ['bail', 'required_if:is_scheduled,true', 'date_format:Y-m-d'],
            'start_time'       => ['bail', 'required_if:is_scheduled,true'],
            'end_time'         => ['bail', 'required_if:is_scheduled,true'],
            'timeZone'         => ['bail', 'required_if:is_scheduled,true'],
            'reason'           => ['required_if:is_scheduled,false'],
            'comments'         => ['bail', 'min:2'],
        ];
    }

    public function messages()
    {
        return [
            'called_at.after_or_equal'     => 'The called date must be today or after today.',
            'appointment_date.required_if' => 'The appointment date is required.',
            'start_time.required_if'       => 'The start time is required.',
            'end_time.required_if'         => 'The end time is required.',
            'called_at.required'           => 'The date called is required.',
            'reason.required_if'           => 'The reason is required.',
        ];
    }
}
