<?php

namespace App\Observers;

use App\Models\Activity\Activity;
use App\Models\Activity\ActivityType;
use App\Models\Request;
use App\Notifications\RequestUpdatedNotification;
use Notification;

class RequestObserver
{
    /**
     * Handle the request "created" event.
     *
     * @param Request $request
     */
    public function created(Request $request)
    {
        // does not currently need a notification
    }

    /**
     * Handle the request "updated" event.
     *
     * @param Request $request
     */
    public function updated(Request $request)
    {
        $user = auth()->user();
        // alert is only necessary if the request has been received and a hp user changes it
        if (!$request->request_status_id || !$user || 2 !== $user->user_type) {
            return;
        }

        /** @var Activity $activity */
        $activity = $request->activities()->create([
            'parent_id'         => null,
            'user_id'           => $user->id,
            'message'           => sprintf('Request updated by %s', $user->full_name),
            'json_message'      => ['user' => $user->full_name],
            'priority'          => 1,
            'notify_admin'      => true,
            'notify_healthplan' => false,
            'notify_reviewer'   => false,
            'notify_therapist'  => false,
        ]);

        // @todo, this will be a preset activity type
        $activityType = ActivityType::firstOrCreate([
            'name'          => 'request.updated',
            'permission'    => 'TBD',
            'privacy_level' => 2,
        ]);
        $activity->activityType()->associate($activityType);

        // @todo move this will be moved to activity created event
        // Notification::send($activity->getNotificationUsers(), new RequestUpdatedNotification($activity));
    }
}
