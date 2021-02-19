<?php

namespace Database\Factories\UserType;

use App\Models\Payer;
use App\Models\UserType\HealthPlanUser;
use Illuminate\Database\Eloquent\Factories\Factory;

class HealthPlanUserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = HealthPlanUser::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'payer_id' => function () {
                return Payer::create(['name' => $this->faker->company]);
            },
        ];
    }
}
