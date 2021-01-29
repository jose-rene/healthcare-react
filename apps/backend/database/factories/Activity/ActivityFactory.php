<?php

namespace Database\Factories\Activity;

use App\Models\Activity\Activity;
use App\Models\Activity\ActivityType;
use App\Models\Request;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Activity::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'request_id' => function () {
                return Request::factory();
            },
            'user_id' => function () {
                return User::factory();
            },
            'activity_type_id' => function () {
                return ActivityType::factory();
            },
            'message' => $this->faker->sentence(),
        ];
    }
}
