<?php

namespace Database\Factories;

use App\Models\RequestItem;
use App\Models\RequestType;
use Illuminate\Database\Eloquent\Factories\Factory;

class RequestItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = RequestItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $itemNames = [
            'wheel chair',
            'skittles',
            'handle bars',
        ];

        return [
            'request_type_id' => function () {
                return RequestType::factory();
            },
            'name'                        => $this->faker->randomElement($itemNames),
            'request_outcome_id'          => $this->faker->numberBetween(1, 4),
            //            'hcpcs'                       => '',
            'note'                        => $this->faker->realText(),
            'clinician_summary'           => $this->faker->realText(),
            'assessment'                  => $this->faker->realText(),
            'decision'                    => $this->faker->realText(),
            'json_data'                   => [],
            'is_additional_consideration' => $this->faker->boolean(70),
        ];
    }
}
