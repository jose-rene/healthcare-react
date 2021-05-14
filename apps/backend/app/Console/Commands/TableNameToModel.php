<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class TableNameToModel extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:model-name {table_name? : name of table}
                                {--m|migration : generate the migration}
                                {--f|force : force}
                                {--d|dump : just output the table name}
    ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Convert plural table name to studly case and create the model and migration is need';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $tableName = $this->argument('table_name');

        if (!$tableName) {
            $tableName = $this->ask('What is the name of the table?');
        }

        throw_if(!$tableName, 'missing-table-name');

        $modelName = Str::of($tableName)->singular()->studly() . '';

        if ($this->option('dump')) {
            $this->newLine(2);
            $this->info($modelName);
            $this->newLine(2);

            return 0;
        }

        $this->info('Generating model name "' . $modelName . '"');
        if ($this->option('migration')) {
            $this->info('With migration');
        }
        $this->call('make:model', [
            'name'        => $modelName,
            '--migration' => $this->option('migration') ?? false,
            '--force'     => $this->option('force') ?? false,
        ]);


        return 0;
    }
}
