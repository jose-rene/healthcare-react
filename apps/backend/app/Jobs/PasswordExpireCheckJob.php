<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Foundation\Bus\Dispatchable;

//use Illuminate\Contracts\Queue\ShouldBeUnique;
//use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Check some criteria on a user and make sure that the password has not expired.
 * Class PasswordExpireCheckJob
 * @package App\Jobs
 */
class PasswordExpireCheckJob /*implements ShouldQueue*/
{
    use Dispatchable;

    //, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var User $user
     */
    private $user;

    /**
     * Create a new job instance.
     *
     * @param $user
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $user = $this->user;

        if ($user->reset_password === true) {
            return; // reset_password is already true; no sense in doing the checks.
        }

        // for the password last changed error we only care about the last time they changed it
        $passwordHistory = $user->password_history->first();

        // If there is no password history then look at the users created_at timestamp
        if (!$passwordHistory) {
            // the second check looks to see if the users created_at timestamp is older then 60 days.
            $reset_password = $user->created_at->diffInDays() >= 60;
        } else {
            // look to see if the users last password change created_at timestamp is older then 60 days.
            $reset_password = $passwordHistory->created_at->diffInDays() >= 60;
        }

        if ($reset_password) {
            // password reset required update the database
            $this->user->update(compact('reset_password'));
        }
    }
}
