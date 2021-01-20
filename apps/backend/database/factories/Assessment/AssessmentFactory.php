<?php

namespace Database\Factories\Assessment;

use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use App\Models\Request;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

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
            'user_id'          => User::factory()->create()->id,
            'questionnaire_id' => Questionnaire::factory()->create()->id,
            'request_id'       => Request::factory()->create()->id,
        ];
    }
}
