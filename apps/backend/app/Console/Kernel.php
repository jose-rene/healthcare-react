<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $log = storage_path('inspector/run.log');
        $day = env('AWS_INSPECTOR_DAY', 1);

        // run inspector scans 1AM monthly
        $schedule->command('inspector:run all')
            ->cron('3 1 ' . $day . ' * *')
            ->appendOutputTo($log);

        // send scan reports 3AM monthly
        $schedule->command('inspector:report all')
            ->cron('9 3 ' . $day . ' * *')
            ->appendOutputTo($log);
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }

    /**
     * Get the timezone that should be used by default for scheduled events.
     *
     * @return \DateTimeZone|string|null
     */
    protected function scheduleTimezone()
    {
        return 'America/Los_Angeles';
    }
}
