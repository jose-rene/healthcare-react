<?php

namespace Database\Seeders;

use App\Models\Payer;
use App\Models\User;
use App\Models\UserType\EngineeringUser;
use App\Models\UserType\HealthPlanUser;
use Bouncer;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $emails = ['admin@admin.com', 'Skylar.Langdon@dme-cg.com', 'Mike.Birkhead@dme-cg.com', 'Zachariha.Robichaud@dme-cg.com', 'andy@dme-cg.com', 'ben@dme-cg.com'];
        // test payer
        $payer = Payer::firstWhere(['name' => 'Test Health Plan']);

        foreach ($emails as $item) {
            $names = explode('@', $item);
            $names = explode('.', $names[0]);
            $admin = User::firstOrCreate(['email' => $item], [
                'email'      => $item,
                'first_name' => $names[0] ?? 'Admin',
                'last_name'  => $names[1] ?? 'Admin',
                'password'   => bcrypt('admin123'),
                'dob'        => new Carbon('-20 years'),
                'user_type'  => 1, // engineering user
            ]);
            // skip the user setup if it was not just created
            if (!$admin->wasRecentlyCreated) {
                break;
            }
            $admin->markEmailAsVerified();
            Bouncer::sync($admin)->roles(['hp_manager', 'software_engineer']);
            // add the user types
            $admin->engineeringUser(EngineeringUser::create());
            // add payer for hp user type
            $hpUser = HealthPlanUser::create();
            $hpUser->payer()->associate($payer)->save();
            // add the hp user type
            $admin->healthPlanUser()->save($hpUser);
        }

//        factory(User::class, random_int(100, 500))->create();
    }
}
