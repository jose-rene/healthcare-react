<?php

namespace App\Models\Activity;

use App\Models\Request;
use App\Models\User;
use App\Notifications\RequestActivity;
use App\Traits\Observable;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class Activity extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;
    use Observable;

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
     * @return void
     */
    public function onCreated()
    {
        if (null === ($users = $this->getNotificationUsers())) {
            Log::error(sprintf('No users found for Activity [%d]', $this->id));

            return;
        }
        Notification::send($users, new RequestActivity($this));
    }

    /*
     * Implement onCreated from observable trait, send notifications.
     *
     * @todo This just returns the activity creator user, should use business logic to return actual recipients.
     *
     * @return array of App/Models/User
     */
    protected function getNotificationUsers()
    {
        return [$this->user];
    }
}
