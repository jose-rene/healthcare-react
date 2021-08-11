<?php

namespace Database\Factories;

use App\Models\Payer;
use App\Models\Classification;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Classification::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name'     => $this->faker->bs,
            'payer_id' => fn () => Payer::factory()->create(),
        ];
    }
}
