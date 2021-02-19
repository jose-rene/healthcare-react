<?php

namespace App\Events;

//use Illuminate\Broadcasting\Channel;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

//use Illuminate\Broadcasting\PresenceChannel;
//use Illuminate\Broadcasting\PrivateChannel;
//use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserChangingPassword
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var User
     */
    public $user;
    public string $oldPassword;

    /**
     * Create a new event instance.
     *
     * @param        $user
     * @param string $oldPassword hash of old password
     */
    public function __construct($user, string $oldPassword)
    {
        $this->user = $user;
        $this->oldPassword = $oldPassword;
    }
}
