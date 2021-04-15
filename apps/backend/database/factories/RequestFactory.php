<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Payer;
use App\Models\Request;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Request::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'status'      => '',
            'auth_number' => Str::random(13),
            'member_id'   => function () {
                return Member::factory()->create();
            },
            'payer_id'    => fn() => Payer::factory()->create(),
        ];
    }
}
