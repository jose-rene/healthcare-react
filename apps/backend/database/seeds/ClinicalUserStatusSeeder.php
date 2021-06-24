<?php

namespace Database\Seeders;

use App\Models\ClinicalUserStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ClinicalUserStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $statuses = [
            'Available',
            'Unavailable',
            'Probation',
            'Scheduling Issues',
            'Vacation',
            'Illness',
            'Pending Training',
            'Credentials Expired',
        ];

        if (0 === ClinicalUserStatus::all()->count()) {
            foreach ($statuses as $name) {
                ClinicalUserStatus::create([
                    'name' => $name,
                    'slug' => Str::snake($name),
                ]);
            }
        }
    }
}
