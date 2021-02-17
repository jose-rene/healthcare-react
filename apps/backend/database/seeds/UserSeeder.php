<?php

namespace Database\Seeders;

use App\Models\User;
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

        foreach ($emails as $item) {
            $names = explode('@', $item);
            $names = explode('.', $names[0]);
            $admin = User::firstOrCreate(['email' => $item], [
                'email'      => $item,
                'first_name' => $names[0] ?? 'Admin',
                'last_name'  => $names[1] ?? 'Admin',
                'password'   => bcrypt('admin123'),
                'dob'        => new Carbon('-20 years'),
            ]);

            $admin->markEmailAsVerified();
            Bouncer::sync($admin)->roles(['hp_manager', 'software_engineer']);
        }

//        factory(User::class, random_int(100, 500))->create();
    }
}
