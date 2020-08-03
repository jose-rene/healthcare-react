<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TestUserSeeder extends Seeder
{
    /**
     * Run the test user seeder.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'first_name' => 'Sky',
            'last_name' => 'Lar',
            'email' => 'skylar@foo.bar',
            'password' => Hash::make('password'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);
    }
}
