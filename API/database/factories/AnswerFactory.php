<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Assessment\Answer;
use App\Models\Assessment\Question;
use Faker\Generator as Faker;

$factory->define(Answer::class, function (Faker $faker) {
    return [
        'question_id' => factory(Question::class)->create()->id,
        'answer' => $faker->sentence(),
    ];
});
