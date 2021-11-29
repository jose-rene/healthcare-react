<?php

namespace App\Observers;

use App\Models\Activity\Activity;
use App\Models\Appointment;

class AppointmentObserver
{
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    // public $afterCommit = true;

    /**
     * Handle the Appointment "created" event.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return void
     */
    public function created(Appointment $appointment)
    {
        // create request dates
        if ($appointment->called_at) {
            $appointment->request->requestDates()->create([
                'request_date_type_id' => 2,
                'date'                 => $appointment->called_at,
            ]);
        }

        if ($appointment->appointment_date) {
            $appointment->request->requestDates()->create([
                'request_date_type_id' => 3,
                'date'                 => $appointment->appointment_date,
            ]);
        }

        // create activity and indirectly the notification
        $apptDate = $appointment->appointment_date ? $appointment->appointment_date->format('d/m/Y') : 'n/a';
        $callDate = $appointment->called_at ? $appointment->called_at->format('m/d/Y') : 'n/a';
        // set the activity message
        $message = sprintf('Member called %s, appointment scheduled %s.', $callDate, $apptDate);
        if ($appointment->is_cancelled) {
            $message = sprintf('Appointment cancelled: %s', $appointment->reason);
        }
        elseif ($appointment->is_reschedule) {
            $message = sprintf('Appointment re-scheduled %s.', $callDate, $apptDate);
        }
        Activity::create([
            'request_id'   => $appointment->request->id,
            'notify_admin' => 1,
            'user_id'      => $appointment->request->clinician_id,
            'priority'     => true,
            'json_message' => ['appointment_date' => $apptDate, 'called_date' => $callDate],
            'message'      => $message,
        ]);
    }

    /**
     * Handle the Appointment "updated" event.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return void
     */
    public function updated(Appointment $appointment)
    {
        //
    }

    /**
     * Handle the Appointment "deleted" event.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return void
     */
    public function deleted(Appointment $appointment)
    {
        //
    }

    /**
     * Handle the Appointment "restored" event.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return void
     */
    public function restored(Appointment $appointment)
    {
        //
    }

    /**
     * Handle the Appointment "force deleted" event.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return void
     */
    public function forceDeleted(Appointment $appointment)
    {
        //
    }
}
