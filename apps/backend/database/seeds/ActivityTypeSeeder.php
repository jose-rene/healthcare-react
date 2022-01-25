<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ActivityTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            'Private',
            'Cancelled',
            'On hold',
            'Reopened',
            'Rate change therapist',
            'Request Update',
            'Scheduling',
        ];

        foreach ($types as $item) {
            ActivityType::firstOrCreate(['name' => $item]);
        }
    }
}
