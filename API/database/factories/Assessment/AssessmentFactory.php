<?php

namespace Database\Factories\Assessment;

use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AssessmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Assessment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'questionnaire_id' => Questionnaire::factory()->create()->id,
        ];
    }
}
