<?php

namespace Database\Seeders;

use App\Models\Payer;
use App\Models\Phone;
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
                'email'          => $item,
                'first_name'     => $names[0] ?? 'Admin',
                'last_name'      => $names[1] ?? 'Admin',
                'password'       => bcrypt('admin123'),
                'reset_password' => false,
                'dob'            => new Carbon('-20 years'),
                'user_type'      => 1, // engineering user
                'primary_role'   => 'software_engineer',
            ]);
            // skip the user setup if it was not just created
            if (!$admin->wasRecentlyCreated) {
                break;
            }
            $admin->markEmailAsVerified();
            // add a phone
            $phone = Phone::factory()->create([
                'phoneable_id' => $admin,
            ]);
            $admin->phones()->save($phone);
            Bouncer::sync($admin)->roles([
                'hp_manager',
                'hp_champion',
                'hp_user',
                'hp_finance',
                'software_engineer',
                'field_clinician',
                'clinical_reviewer',
            ]);
            // add the user types
            $admin->engineeringUser(EngineeringUser::create());
            // add payer for hp user type
            $hpUser = HealthPlanUser::create(['job_title' => 'Executive Coordinator']);
            $hpUser->payer()->associate($payer)->save();
            // add the hp user type
            $admin->healthPlanUser()->save($hpUser);
            // add the field clinician user type
            $admin->clinicalServicesUser()->create([
                'clinical_type_id'        => 1,
                'clinical_user_status_id' => 1,
                'clinical_user_type_id'   => 1, // this is probably uneccessary it's handled by role
            ]);
        }

//        $users = User::factory()->count(random_int(1000, 5000))->create();
//
//        foreach($users as $user){
//            Bouncer::sync($user)->roles(['hp_manager', 'software_engineer']);
//        }

//        factory(User::class, random_int(100, 500))->create();
    }
}
