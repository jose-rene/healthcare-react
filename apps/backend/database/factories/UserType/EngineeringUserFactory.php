<?php

namespace Database\Factories\UserType;

use App\Models\UserType\EngineeringUser;
use Illuminate\Database\Eloquent\Factories\Factory;

class EngineeringUserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EngineeringUser::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'gitlab_name' => $this->faker->userName,
        ];
    }
}
