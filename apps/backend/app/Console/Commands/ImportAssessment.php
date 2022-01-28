<?php

namespace App\Console\Commands;

use App\Models\Assessment;
use App\Models\Form;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportAssessment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assessment:import {name=Standard Assessment : The assessment name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports an assessment csv file.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $name = $this->argument('name');
        if (null === ($assessment = (Assessment::firstWhere('name', $name)))) {
            $assessment = Assessment::create(['name' => $name]);
        }

        $verify = strtolower($this->ask('Importing an assessment will overwrite current data, are you sure (y/n)?'));
        if ('y' !== $verify) {
            $this->info('Import has been cancelled.');
            return;
        }

        if (!file_exists($path = base_path('database/import/' . Str::kebab($assessment->name) . '.csv'))) {
            $this->error(sprintf('The csv file, %s, does not exist', $path));
            return;
        }

        $assessmentForms = [];
        $header = null;
        $handle = fopen($path, "r");

        while (false !== ($row = fgetcsv($handle))) {
            if (!$header) {
                $header = $row;
                continue;
            }
            $data = array_combine($header, $row);
            if (null === ($form = Form::firstWhere('slug', $data['slug']))) {
                $form = Form::create([
                    'name' => $data['name'],
                    'slug' => $data['slug'],
                    'description' => $data['description'],
                ]);
            }
            else {
                $form->update([
                    'name' => $data['name'],
                    'description' => $data['description'],
                ]);
            }
            // insert raw json without converting to array first
            DB::update('update forms set fields = ? where id = ?', [$data['fields'], $form->id]);
            $assessmentForms[$form->id] = ['position' => $data['position']];
        }
        fclose($handle);
        // sync the pivot relationship
        $assessment->forms()->sync($assessmentForms);

        $this->info(sprintf('Successfully imported from [%s]', $path));
    }
}
