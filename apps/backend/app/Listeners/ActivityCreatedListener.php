<?php

namespace App\Listeners;

use App\Events\ActivityCreated;
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
        // @todo dispatch notifications based upon $event->activity data
    }
}
