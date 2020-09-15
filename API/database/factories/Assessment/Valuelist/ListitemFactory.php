<?php

namespace Database\Factories\Assessment\Valuelist;

use App\Models\Assessment\Valuelist\Listitem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ListitemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Listitem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->unique()->randomDigit,
            'val'   => $this->faker->colorName,
        ];
    }
}
