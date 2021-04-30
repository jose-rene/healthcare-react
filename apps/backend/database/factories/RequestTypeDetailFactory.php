<?php

namespace Database\Factories;

use App\Models\RequestType;
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
            'request_type_id' => fn () => RequestType::factory()->create(),
            'name'            => 'RD ' . $this->faker->catchPhrase(), // $this->faker->randomElement($randomDetails),
            'is_default'      => (int) $this->faker->boolean(30),
        ];
    }
}
