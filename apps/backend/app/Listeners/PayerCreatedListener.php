<?php

namespace App\Listeners;

use App\Events\PayerCreated;
use App\Models\MemberNumberType;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

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
     * @param  object  $event
     * @return void
     */
    public function handle(PayerCreated $event)
    {
        // get the default member number types
        $types = MemberNumberType::all()->map(fn ($item) => ['name' => $item['name'], 'title' => $item['title']]);
        // add these to the payer member number types
        $event->payer->memberNumberTypes()->createMany($types);
    }
}
