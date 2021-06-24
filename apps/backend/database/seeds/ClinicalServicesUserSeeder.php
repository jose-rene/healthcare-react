<?php

namespace Database\Seeders;

use App\Models\UserType\ClinicalServicesUser;
use Illuminate\Database\Seeder;

class ClinicalServicesUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $count = 1;
        // prompt for the number of requests if not unit test env
        if ('testing' !== app()->environment()) {
            $count = (int) $this->command->ask('How many clinicians would you like to seed?');
        }

        ClinicalServicesUser::factory()->count($count)->create();
    }
}
