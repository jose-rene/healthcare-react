<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;

class UserFollowingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @param Faker $faker
     * @return void
     */
    public function run(Faker $faker)
    {
        $users = \App\Models\User::all();

        $ids = $users->pluck('id')->toArray();

        $random_users = $faker->randomElements($users, random_int(10, 50));
        dd($random_users);

        foreach($users as $user)
        {
            $following_id = $faker->randomElement($ids);

            factory(\App\Models\UserFollowing::class, 100);
        }
    }
}
