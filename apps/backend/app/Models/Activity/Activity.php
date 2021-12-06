<?php

namespace App\Models\Activity;

use App\Events\ActivityCreated;
use App\Models\Request;
use App\Models\User;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

//use App\Traits\Observable;

/**
 * @property Request request
 * @property mixed   notify_healthplan
 * @property mixed   notify_admin
 * @property mixed   notify_reviewer
 * @property mixed   notify_therapist
 * @property array   json_message
 * @property string  message
 * @property mixed   request_id
 * @property User    user
 */
class Activity extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    protected $fillable = [
        'parent_id',
        'request_id',
        'user_id',
        'activity_type_id',
        'message',
        'priority',
        'notify_admin',
        'notify_healthplan',
        'notify_reviewer',
        'notify_therapist',
        'json_message',
        'activity_reason_id',
    ];

    protected $casts = [
        'priority'          => 'boolean',
        'notify_admin'      => 'boolean',
        'notify_healthplan' => 'boolean',
        'notify_reviewer'   => 'boolean',
        'notify_therapist'  => 'boolean',
        'json_message'      => 'json',
    ];

    protected $dispatchesEvents = [
        'created' => ActivityCreated::class,
    ];

    /**
     * Relationship to request.
     *
     * @return Request
     */
    public function request()
    {
        return $this->belongsTo(Request::class);
    }

    /**
     * Relationship to user (that created activity).
     *
     * @return User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship to activity type.
     *
     * @return ActivityType
     */
    public function activityType()
    {
        return $this->belongsTo(ActivityType::class);
    }

    /**
     * Relationship to activity parent.
     *
     * @return Activity
     */
    public function parent()
    {
        return $this->hasOne(self::class, 'id', 'parent_id');
    }

    /**
     * Returns child activities.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Model\Activity\Activity
     */
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('id', 'desc');
    }

     /**
     * Will implement the recursive relationship and return the hiarchy of child activities.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Activity\Activity
     */
    public function activities()
    {
        return $this->hasMany(self::class, 'parent_id')->with('children')->orderBy('id', 'desc');
    }

    /*
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    /*
     * Implement onCreated from observable trait, send notifications.
     *
     * @todo Should check user notification_prefs to make sure there are notification prefs set.
     *
     * @return array of App/Models/User
     */
    public function getNotificationUsers()
    {
        $users = [];

        if ($this->notify_admin) {
            $users[] = User::where('primary_role', 'client_services_specialist')->get();
        }

        if ($this->notify_reviewer) {
            $users[] = $this->request->reviewer;
        }

        if ($this->notify_therapist) {
            $users[] = $this->request->clinician;
        }

        return collect($users)->push($this->user)->unique()->values()->all();
    }

    public function activityReason()
    {
        return $this->hasOne(ActivityReason::class, 'activity_reason_id');
    }
}
