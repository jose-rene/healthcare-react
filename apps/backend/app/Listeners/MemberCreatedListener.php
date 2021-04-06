<?php

namespace App\Listeners;

use App\Events\MemberCreated;
use App\Jobs\MemberPayerHistoryAddJob;

class MemberCreatedListener
{
    /**
     * Handle the event.
     *
     * @param MemberCreated $event
     * @return void
     */
    public function handle(MemberCreated $event)
    {
        dispatch(new MemberPayerHistoryAddJob($event->member));
    }
}
