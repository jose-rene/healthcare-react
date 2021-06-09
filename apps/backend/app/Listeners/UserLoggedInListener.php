<?php

namespace App\Listeners;

use App\Models\LoginHistory;
use Browser;

class UserLoggedInListener
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
    public function handle($event)
    {
        LoginHistory::create([
            'user_id'         => $event->user->id,
            'ip'              => request()->ip(),
            'browser'         => ($value = Browser::browserName()) ? $value : 'NA',
            'browser_family'  => Browser::browserFamily(),
            'browser_version' => ($value = Browser::browserVersion()) ? $value : 'NA',
            'browser_engine'  => ($value = Browser::browserEngine()) ? $value : 'NA',
            'os'              => ($value = Browser::platformName()) ? $value : 'NA',
            'os_family'       => Browser::platformFamily(),
            'os_version'      => ($value = Browser::platformVersion()) ? $value : 'NA',
            'device'          => Browser::deviceFamily(),
            'device_model'    => ($value = Browser::deviceModel()) ? $value : 'NA',
            'ua'              => Browser::userAgent(),
        ]);
    }
}
