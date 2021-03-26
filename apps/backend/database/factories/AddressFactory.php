<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Address::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'is_primary'       => 1,
            'address_1'        => $this->faker->streetAddress,
            'city'             => $this->faker->city,
            'county'           => $this->faker->lastName,
            'state'            => $this->faker->stateAbbr,
            'postal_code'      => $this->faker->postcode,
            'addressable_type' => Member::class,
            'addressable_id'   => function () {
                return Member::factory();
            },
        ];
    }
}
