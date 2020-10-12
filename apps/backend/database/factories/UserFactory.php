<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'first_name'  => $this->faker->firstName,
            'middle_name' => $this->faker->boolean ? $this->faker->firstName : null,
            'last_name'   => $this->faker->lastName,
            'email'       => $this->faker->unique()->safeEmail,
            'dob'         => new Carbon($this->faker->dateTimeBetween('-50 years', '-15 Years')),
            'password'    => bcrypt('password'),
        ];
    }
}