<?php

namespace App\Listeners;

use App\Events\UserChangingPassword;

class TrackPasswordResets
{
    /**
     * Handle the event.
     *
     * @param UserChangingPassword $event
     * @return void
     */
    public function handle(UserChangingPassword $event): void
    {
        $event->user->password_history()->create([
            'password' => $event->oldPassword,
        ]);
    }
}
