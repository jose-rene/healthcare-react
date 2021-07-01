<?php

namespace Database\Factories;

use App\Models\Model;
use App\Models\Model\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClinicalServicesUserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Model::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id'                 => fn () => UserFactory::create(['user_type' => User::mapType('ClinicalServicesUser')]),
            'clinical_user_type_id'   => 1,
            'clinical_type_id'        => 1,
            'clinical_user_status_id' => 1,
        ];
    }
}
