<?php

namespace App\Events;

use App\Models\FormAnswer;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RequestFormSectionSavedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public FormAnswer $answers;

    /**
     * Create a new event instance.
     *
     * @param FormAnswer $answers
     */
    public function __construct(FormAnswer $answers)
    {
        $this->answers = $answers;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('form-status');
    }
}
