<?php

namespace Database\Factories\Assessment;

use App\Models\Assessment\Question;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class QuestionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Question::class;

    public function definition()
    {
        $possible_questions = [
        'What is you favorite color?',
        'What is you favorite number?',
    ];

        $question_key = $this->faker->randomKey($possible_questions);

        return [
            'title'        => $possible_questions[$question_key],
            'name'         => $question_key,
            'position'     => 1,
            'ele_type'     => 'select',
            'dependencies' => ['visible' => ['what_color' => $this->faker->colorName], 'required' => ['what_number' => $this->faker->randomDigit]],
        ];
    }
}
