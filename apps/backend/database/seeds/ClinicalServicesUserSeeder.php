<?php

namespace Database\Seeders;

use App\Models\UserType\ClinicalServicesUser;
use App\Models\Phone;
use Illuminate\Database\Seeder;
use Bouncer;

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

        $clinicians = ClinicalServicesUser::factory()->count($count)->create();
        $clinicians->each(function($fc) {
            $phone = Phone::factory()->create([
                'phoneable_id' => $fc->user,
            ]);
            $fc->user->phones()->save($phone);
            $fc->user->update(['primary_role' => 'field_clinician']);
            Bouncer::sync($fc->user)->roles(['field_clinician']);
        });
    }
}
