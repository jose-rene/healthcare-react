<?php

namespace App\Models\Activity;

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
     * Returns child activities.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Model\Activity\Activity
     */
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('id', 'desc');
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
     * @todo This just returns the activity creator user, should use business logic to return actual recipients.
     * Should also check user notification_prefs to make sure there are notification prefs set.
     *
     * @return array of App/Models/User
     */
    public function getNotificationUsers()
    {
        $users = [];

        if ($this->notify_admin) {
            // TODO :: get admin
            $users[] = $this->request->admin;
        }

        if ($this->notify_reviewer) {
            // TODO :: get reviewer user
            $users[] = $this->request->reviewer;
        }

        if ($this->notify_therapist) {
            // TODO :: get therapist
            $users[] = $this->request->therapist;
        }

        // TODO :: DEV remove and collect dynamically
        $users[] = $this->user;

        return $users;
    }

    public function activityReason()
    {
        return $this->hasOne(ActivityReason::class, 'activity_reason_id');
    }
}
