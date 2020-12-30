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
        $log = storage_path('logs/inspector.log');
        $day = env('AWS_INSPECTOR_DAY', 1);

        // run inspector scans 1AM monthly
        $hour = 1;
        $schedule->command('inspector:run all')
            ->cron('5 ' . $hour . ' ' . $day . ' * *')
            ->appendOutputTo($log);

        // send scan reports monthly, 1 hour after run, run 3 times in case it takes longer
        for ($xx = 0; $xx < 3; $xx++) {
            $hour ++;
            $schedule->command('inspector:report all')
                ->cron('10 ' . $hour . ' ' . $day . ' * *')
                ->appendOutputTo($log);
        }
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
