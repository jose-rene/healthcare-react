<?php

namespace App\Listeners;

use App\Events\PayerCreated;
use App\Models\MemberNumberType;

class PayerCreatedListener
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
     * @param object $event
     * @return void
     */
    public function handle(PayerCreated $event)
    {
        // get the default member number types
        $types = MemberNumberType::all()->pluck('id')->toArray();
        // add these to the payer member number types
        $event->payer->memberNumberTypes()->sync($types);
    }
}
