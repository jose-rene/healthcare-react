<?php

namespace App\Listeners;

use App\Events\ActivityCreated;
use App\Notifications\RequestActivity as ActivityNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ActivityCreatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ActivityCreated  $event
     * @return void
     */
    public function handle(ActivityCreated $event)
    {
        $notification = new ActivityNotification($event->activity);
        $event->activity->getNotificationUsers()->each(function($user) use($notification) {
            $user->notify($notification);
        });
    }
}
