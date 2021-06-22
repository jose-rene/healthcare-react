<?php

namespace Database\Factories;

use App\Models\Email;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Email::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'email'          => $this->faker->companyEmail,
            'is_primary'     => 1,
            'contact_type'   => 'Email',
            'emailable_type' => User::class,
            'emailable_id'   => function () {
                return User::factory();
            },
        ];
    }
}
