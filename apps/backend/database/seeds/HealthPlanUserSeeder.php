<?php

namespace Database\Seeders;

use App\Models\Payer;
use App\Models\User;
use Bouncer;
use Illuminate\Database\Seeder;

class HealthPlanUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $payer = Payer::firstOrCreate(['name' => 'Test Health Plan'], ['name' => 'Test Health Plan']);

        User::factory()
            ->count(25)
            ->hasHealthPlanUser(1, ['payer_id' => $payer->id])
            // add a phone
            ->hasPhones(1)
            ->create(['user_type' => 2, 'primary_role' => 'hp_user'])
            ->each(function ($user) {
                $user->markEmailAsVerified();
                Bouncer::sync($user)->roles(['hp_user']);
            });
    }
}
