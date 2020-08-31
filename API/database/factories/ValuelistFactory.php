<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Assessment\Valuelist\Valuelist;
use Faker\Generator as Faker;

$factory->define(Valuelist::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
    ];
});
