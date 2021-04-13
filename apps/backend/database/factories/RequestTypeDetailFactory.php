<?php

namespace Database\Factories;

use App\Models\RequestTypeDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

class RequestTypeDetailFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = RequestTypeDetail::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $randomDetails = [
            'bag',
            'wheels',
            'hard seat',
            'uncomfortable seat',
            'huge pants',
        ];

        return [
            'name' => $this->faker->randomElement($randomDetails),
        ];
    }
}
