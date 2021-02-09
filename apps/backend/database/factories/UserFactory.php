<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

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
            'user_type'          => User::mapType('EngineeringUser'),
            'first_name'         => $this->faker->firstName,
            'middle_name'        => $this->faker->boolean ? $this->faker->firstName : null,
            'last_name'          => $this->faker->lastName,
            'email'              => $this->faker->unique()->safeEmail,
            'notification_prefs' => ['mail'],
            'dob'                => new Carbon($this->faker->dateTimeBetween('-50 years', '-15 Years')),
            'email_verified_at'  => Carbon::now(),
            'password'           => Hash::make('password'),
        ];
    }
}
