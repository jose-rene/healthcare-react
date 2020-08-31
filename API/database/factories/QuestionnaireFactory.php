<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Assessment\Questionnaire;
use Faker\Generator as Faker;

$factory->define(App\Models\Assessment\Questionnaire::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
    ];
});
