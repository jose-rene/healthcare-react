<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class SftpToS3 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sftp:transfer';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Transfer sftp files to bucket';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $files = Storage::disk('sftp-molina')->allFiles('.');

        if (empty($files)) {
            return 0;
        }
        // copy files to bucket and remove
        foreach ($files as $name) {
            $path = 'molina/active/' . str_replace('live/', '', $name);
            if (Storage::disk('s3-molina')->put($path, Storage::disk('sftp-molina')->get($name))) {
                Storage::disk('sftp-molina')->delete($name);
            }
        }
        return 0;
    }
}
