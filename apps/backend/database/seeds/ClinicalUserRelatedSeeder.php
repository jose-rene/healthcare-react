<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ClinicalUserRelatedSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // clinical services user seeders
        $this->call(ClinicalUserStatusSeeder::class);
        $this->call(ClinicalTypeSeeder::class);
        $this->call(ClinicalUserTypeSeeder::class);
    }
}
