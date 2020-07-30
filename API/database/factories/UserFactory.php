<?php

/** @var Factory $factory */

use App\Models\User;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {

    $notification_types = [
        'at-now',
        'at-upcoming',
    ];

    return [
        'first_name'        => $faker->firstName,
        'middle_name'       => $faker->boolean ? $faker->firstName : null,
        'last_name'         => $faker->lastName,
        'email'             => $faker->unique()->safeEmail,
        'dob'               => new Carbon\Carbon($faker->dateTimeBetween('-50 years', '-15 Years')),
        'password'          => bcrypt('password'),
        'notification_type' => $faker->randomElements($notification_types, count($notification_types)),
    ];
});
