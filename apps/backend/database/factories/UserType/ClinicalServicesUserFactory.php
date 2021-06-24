<?php

namespace Database\Factories\UserType;

use App\Models\User;
use App\Models\UserType\ClinicalServicesUser;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClinicalServicesUserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ClinicalServicesUser::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id'                 => fn ()                 => User::factory()->create(['user_type' => User::mapType('ClinicalServicesUser')]),
            'clinical_user_type_id'   => 1,
            'clinical_type_id'        => 1,
            'clinical_user_status_id' => 1,
        ];
    }
}
