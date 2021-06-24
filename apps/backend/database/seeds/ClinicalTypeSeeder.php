<?php

namespace Database\Seeders;

use App\Models\ClinicalType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ClinicalTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            'PT',
            'OT',
            'Nurse',
            'Speech',
        ];

        if (0 === ClinicalType::all()->count()) {
            foreach ($types as $name) {
                ClinicalType::create([
                    'name' => $name,
                    'slug' => Str::snake($name),
                ]);
            }
        }
    }
}
