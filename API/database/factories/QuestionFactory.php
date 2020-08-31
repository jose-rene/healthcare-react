<?php

/** @var Factory $factory */

use App\Models\Assessment\Question;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Question::class, function (Faker $faker) {

    $possible_questions = [
        'What is you favorite color?',
        'What is you favorite number?',
    ];

    $question_key = $faker->randomKey($possible_questions);

    return [
        'title'        => $possible_questions[ $question_key ],
        'name'         => $question_key,
        'position'     => 1,
        'ele_type'     => 'select',
        'dependencies' => ['visible' => ['what_color' => $faker->colorName], 'required' => ['what_number' => $faker->randomDigit]],
    ];
});
