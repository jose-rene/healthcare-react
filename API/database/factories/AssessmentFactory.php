<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use Faker\Generator as Faker;

$factory->define(Assessment::class, function (Faker $faker) {
    return [
        'questionnaire_id' => factory(Questionnaire::class)->create()->id,
    ];
});
