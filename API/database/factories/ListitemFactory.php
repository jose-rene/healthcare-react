<?php

/** @var Factory $factory */

use App\Models\Assessment\Valuelist\Listitem;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Listitem::class, function (Faker $faker) {
    return [
        'title' => $faker->unique()->randomDigit,
        'val'   => $faker->colorName,
    ];
});
