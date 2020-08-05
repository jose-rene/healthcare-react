<?php

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
        $admin_email = 'admin@admin.com';

        /** @var User $admin */
        $admin = User::firstOrCreate(['email' => $admin_email], [
            'email'             => $admin_email,
            'first_name'        => 'admin',
            'last_name'         => 'admin',
            'password'          => bcrypt('admin'),
            'dob'               => new Carbon('-20 years'),
        ]);

        $admin->markEmailAsVerified();

        // TODO :: make sure the admin has admin abilities
//        $admin->assign('admin');

        factory(User::class, random_int(100, 500))->create();
    }
}
