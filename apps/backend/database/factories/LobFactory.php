<?php

namespace Database\Factories;

use App\Models\Lob;
use Illuminate\Database\Eloquent\Factories\Factory;

class LobFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Lob::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->catchPhrase,
        ];
    }
}
