<?php

namespace App\Events;

use App\Models\Payer;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PayerCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payer;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Payer $payer)
    {
        $this->payer = $payer;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [];
    }
}
