<?php

namespace Database\Seeders;

use App\Models\User;
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
        }

        // TODO :: make sure the admin has admin abilities
//        $admin->assign('admin');

//        factory(User::class, random_int(100, 500))->create();
    }
}
