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
        $this->call(AssessmentSeeder::class);
        $this->call(MemberSeeder::class);
        $this->call(LanguageSeeder::class);
        $this->call(RequestTypeSeeder::class);
    }
}
