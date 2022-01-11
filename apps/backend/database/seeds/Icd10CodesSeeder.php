<?php

namespace Database\Seeders;

use App\Models\Icd10Code;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\LazyCollection;

class Icd10CodesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if ('testing' === app()->environment()) {
            // seed a test code
            Icd10Code::create([
                'code'        => 'A200',
                'description' => 'Bubonic plague',
            ]);

            return;
        }
        if (!file_exists($path = base_path('database/import/icd10cm_codes_2022.txt'))) {
            $this->command->error(sprintf('The data file, %s, does not exist', $path));
            return;
        }
        if (Icd10Code::count()) {
            $this->command->error(sprintf('The icd10_codes table is already seeded.', $path));
            return;
        }
        LazyCollection::make(function () use(&$path) {
            $fh = fopen($path, 'r');
            while ($line = fgets($fh, 1024)) {
                yield $line;
            }
            fclose($fh);
        })
            ->chunk(10000) // split in chunk
            ->each(function ($lines) {
                $list = [];
                foreach ($lines as $item) {
                    $data = preg_split('~\s{2,}~', $item);
                    if (isset($data[1])) {
                        $list[] = [
                            'code'        => $data[0],
                            'description' => trim($data[1]), // will get rid of line feeds
                        ];
                    }
                }
                // insert 10000 rows
                Icd10Code::insert($list);
            });

        // set timestamps
        $timestamp = Carbon::now()->format('Y-m-d H:i:s');
        DB::update('update icd10_codes set created_at=?, updated_at=?', [$timestamp, $timestamp]);
    }
}
