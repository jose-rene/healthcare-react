<?php

namespace Database\Factories;

use App\Models\Assessment;
use App\Models\AssessmentRule;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentRuleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AssessmentRule::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->catchPhrase() . ' Rule',
            'assessment_id' => Assessment::factory()->hasForms(3)->create(),
        ];
    }
}
