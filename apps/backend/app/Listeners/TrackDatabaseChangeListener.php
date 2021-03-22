<?php

namespace App\Listeners;

use App\Models\Entity;
use DB;
use Illuminate\Database\Events\MigrationsEnded;
use Illuminate\Support\Arr;
use Schema;
use Symfony\Component\Console\Output\ConsoleOutput;

class TrackDatabaseChangeListener
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

    public function consoleWrite(string $text = '')
    {
        if (app()->runningInConsole()) {
            $output = new ConsoleOutput();
            $output->writeln("<info>{$text}</info>");
        }
    }

    /**
     * Handle the event.
     *
     * @param MigrationsEnded $event
     * @return void
     */
    public function handle(MigrationsEnded $event)
    {
        // at minimum the entities table is required for this to work.
        if (!Schema::hasTable('entities')) {
            logger()->error('Missing the entities table');
            $this->consoleWrite('Missing the entities table');
            return;
        }

        if (DB::connection()->getDriverName() !== 'mysql') {
            $this->consoleWrite('this listener only runs for mysql');
            return;
        }

        $this->consoleWrite('Populating the `entities` table');

        $tables = DB::select('SHOW TABLES');

        // show tables column name is dynamic. attempt to pull the first tables column key
        $firstTableEntry = get_object_vars($tables[0]);
        $dmeTableKey     = array_keys($firstTableEntry)[0];

        foreach ($tables as $key => $_table) {
            $table         = $_table->$dmeTableKey;
            $table_columns = DB::select("DESCRIBE {$table}");

            // This connect gets comments from columns in a predictable way
            $columns = DB::connection()
                ->getDoctrineSchemaManager()
                ->listTableDetails($table);

            // look the columns and build out the attributes
            foreach ($columns->getColumns() as $column) {
                $find = [
                    'entity'      => $table,
                    'column_name' => $column->getName(),
                ];

                // get column comment
                $comment = $columns->getColumn($find['column_name'])->getComment() ?? '';

                // attempt to find the working column from the column list.
                $foundColumn = Arr::where($table_columns, function ($a) use ($find) {
                    return $a->Field == $find['column_name'];
                }); // fails when fields not found. add checks to this.

                // Arr::where returns the index that is found. We just need the first column found
                $foundColumn = Arr::first($foundColumn);

                // is this column a primary key
                $is_primary_key = $foundColumn->Key == 'PRI';
                $is_nullable    = strtolower($foundColumn->Null) == 'yes';

                $data = [
                    'data_type'  => $column->getType()->getName(),
                    'key'        => $is_primary_key,
                    'nullable'   => $is_nullable,
                    'comments'   => $comment ?? 'not set',
                    'cache_json' => (array)$foundColumn + compact('comment'),
                ];

                Entity::updateOrCreate($find, $find + $data);
            }
        }
    }
}
