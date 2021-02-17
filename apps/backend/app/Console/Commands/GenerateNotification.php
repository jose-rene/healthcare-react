<?php

namespace App\Console\Commands;

use App\Models\Activity\Activity;
use App\Models\User;
use Illuminate\Console\Command;

class GenerateNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gry:generate-notification {--u|user=1 : which user id to generate a notification for.}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates a simple test notification for a user';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user_id = $this->option('user');
        User::findOrFail($user_id);

        Activity::factory()->create(
            [
                'user_id' => $user_id,
            ]
        );

        return 0;
    }
}
