<?php

namespace Database\Factories\Activity;

use App\Models\Activity\ActivityType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ActivityType::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name'       => 'Request',
            'permission' => 'TBD',
            'visible'    => '1',
        ];
    }
}
