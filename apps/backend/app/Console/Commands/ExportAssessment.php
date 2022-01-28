<?php

namespace App\Console\Commands;

use App\Models\Assessment;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ExportAssessment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assessment:export {name=Standard Assessment : The assessment name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Exports a given assessment in csv format.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $name = $this->argument('name');
        if (null === ($assessment = (Assessment::firstWhere('name', $name)))) {
            $this->error(sprintf('The assessment does not exists: %s.', $name));
            return 0;
        }

        $header = [
            'slug',
            'name',
            'description',
            'fields',
            'position',
        ];

        $data = $assessment->forms->map(fn ($item) => [
            'slug'        => $item->slug,
            'name'        => $item->name,
            'description' => $item->description,
            'fields'      => $item->getRawOriginal('fields'), // get the json
            'position'    => $item->pivot->position,
        ]);

        $fp = fopen(base_path($path = 'database/import/' . Str::kebab($assessment->name) . '.csv'), 'w');
        fputcsv($fp, $header);
        $data->each(fn($item) => fputcsv($fp, $item));
        fclose($fp);
        $this->info(sprintf('Successfully exported to [%s]', $path));
    }
}
