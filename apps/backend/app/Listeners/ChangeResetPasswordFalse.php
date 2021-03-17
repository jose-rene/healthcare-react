<?php

namespace App\Listeners;

use App\Events\UserChangingPassword;

//use Illuminate\Contracts\Queue\ShouldQueue;
//use Illuminate\Queue\InteractsWithQueue;

class ChangeResetPasswordFalse
{
    /**
     * User has changed their password. Its safe to change reset_password to false
     *
     * @param UserChangingPassword $event
     * @return void
     */
    public function handle(UserChangingPassword $event)
    {
        $event->user->update(['reset_password' => false]);
    }
}
