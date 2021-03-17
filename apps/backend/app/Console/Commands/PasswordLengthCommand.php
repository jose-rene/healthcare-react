<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;

class PasswordLengthCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gry:password-length-check {--d|debug : Just get the list and output to the screen}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This will check the database for users that need to reset their password';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // FIXME :: This is probably not right
        $users = DB::table('users')
            ->leftJoin(
                DB::raw('password_histories ph'),
                function ($q) {
                    $q->where('user_id', '=', 'users.id');
                }
            )
            ->select('ph.created_at', 'users.*')
            ->get();

        if ($this->option('debug')) {
            dump($users->toArray());
            return 0;
        }

        return 0;
    }
}
