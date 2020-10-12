<?php

namespace Database\Factories\Assessment;

use App\Models\Assessment\Answer;
use App\Models\Assessment\Question;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AnswerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Answer::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'question_id' => Question::factory()->create()->id,
            'answer'      => $this->faker->sentence(),
        ];
    }
}
