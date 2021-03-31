<?php

namespace App\Listeners;

use App\Events\DatabaseRefreshed;
use Artisan;

use function Illuminate\Support\Facades\File;

class DatabaseRefreshedListener
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
     * @param \Illuminate\Database\Events\DatabaseRefreshed $event
     * @return void
     */
    public function handle(\Illuminate\Database\Events\DatabaseRefreshed $event)
    {
        if (config('passport.auto_passport') === true) {
            Artisan::call('passport:install', []);
            $output = Artisan::output();

            file_put_contents(storage_path('app/keys.txt'), "\r\n\r\n" . $output . "\r\n", FILE_APPEND);
        }
    }
}
