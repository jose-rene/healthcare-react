<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Payer;
use App\Models\Request;
use App\Models\User;
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
        $payer = Payer::factory()->create();
        $member = Member::factory()->create(['payer_id' => $payer]);

        return [
            'auth_number'             => Str::random(13),
            'member_id'               => fn() => $member,
            'payer_id'                => fn() => $payer,
            'payer_user_id'           => fn() => User::factory()->create(['user_type' => User::mapType('HealthPlanUser')]),
            'member_payer_history_id' => fn() => $member->history->first(),
            'member_address_id'       => fn() => $member->address,
        ];
    }
}
