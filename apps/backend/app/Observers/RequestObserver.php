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
        $request->activities()->create([
            'parent_id'         => null,
            'user_id'           => auth()->id() ?? '1',
            'message'           => 'request.started',
            'priority'          => 0,
            'notify_admin'      => false,
            'notify_healthplan' => false,
            'notify_reviewer'   => false,
            'notify_therapist'  => false,
        ]);
    }

    /**
     * Handle the request "updated" event.
     *
     * @param Request $request
     */
    public function updated(Request $request)
    {
        $json_message = [];

        if ($request->wasChanged(['request_status_id'])) {
            $json_message = [
                'old' => [
                    'Status Name' => $request->getOriginal('status_name'),
                ],
                'new' => [
                    'Status Name' => $request->status_name,
                ],
            ];
        }


        if (!empty($json_message)) {
            /** @var Activity $activity */
            $activity = $request->activities()->create([
                'parent_id'         => null,
                'user_id'           => auth()->id() ?? '1', // TODO :: DEV :: remove ?? 1
                'message'           => 'request.updated',
                'json_message'      => $json_message,
                'priority'          => 0,
                'notify_admin'      => false,
                'notify_healthplan' => false,
                'notify_reviewer'   => false,
                'notify_therapist'  => false,
            ]);

            $activityType = ActivityType::firstOrCreate(['name'       => 'request.updated',
                                                         'permission' => 'TBD',
                                                         'visible'    => true,
            ]);
            $activity->activityType()->associate($activityType);

            Notification::send($activity->getNotificationUsers(), new RequestUpdatedNotification($activity));
        }
    }
}
