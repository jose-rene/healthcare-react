<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(BouncerSeeder::class);
        $this->call(PayerSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(MemberSeeder::class);
        $this->call(LanguageSeeder::class);
        $this->call(MediaTagSeeder::class);
        // request related seeders
        $this->call(RequestTypeSeeder::class);
        $this->call(RequestDateTypeSeeder::class);
        $this->call(ActivityTypeSeeder::class);
        // clinical services user relation seeders
        $this->call(ClinicalUserRelatedSeeder::class);
        // icd10 code seeder
        $this->call(Icd10CodesSeeder::class);
    }
}
