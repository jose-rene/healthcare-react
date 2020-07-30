<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\UserFollowing;
use Faker\Generator as Faker;

$factory->define(UserFollowing::class, function (Faker $faker) {
    $is_approved = $faker->boolean;

    return [
        'is_approved' => $is_approved,
        'is_blocked'  => !$is_approved,
    ];
});
