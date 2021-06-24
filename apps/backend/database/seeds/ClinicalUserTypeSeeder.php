<?php

namespace Database\Seeders;

use App\Models\ClinicalUserType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ClinicalUserTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            'Clinician',
            'Reviewer',
            'Senior Reviewer',
        ];

        if (0 === ClinicalUserType::all()->count()) {
            foreach ($types as $name) {
                ClinicalUserType::create([
                    'name' => $name,
                    'slug' => Str::snake($name),
                ]);
            }
        }
    }
}
