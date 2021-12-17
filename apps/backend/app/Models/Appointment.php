<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @observer App\Observers\AppointmentObserver
 **/
class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'is_scheduled'     => 'boolean',
        'is_reschedule'    => 'boolean',
        'is_cancelled'     => 'boolean',
        'called_at'        => 'date',
        'appointment_date' => 'date',
        'start_time'       => 'datetime',
        'end_time'         => 'datetime',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'request_id',
        'clinician_id',
        'is_scheduled',
        'is_reschedule',
        'is_cancelled',
        'called_at',
        'reason',
        'cancel_reason',
        'comments',
        'appointment_date',
        'canceled_at',
        'start_time',
        'end_time',
    ];

    /**
     * Relationship to request.
     *
     * @return BelongsTo of App\Models\Request
     */
    public function request()
    {
        return $this->belongsTo(Request::class);
    }
}
