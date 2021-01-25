<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

class MemberFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Member::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $genderOptions = ['male', 'female'];
        $gender = $genderOptions[$genderType = rand(0, 1)];

        return [
            'gender'     => $gender,
            'name_title' => $genderType ? $this->faker->titleFemale : $this->faker->titleMale,
            'first_name' => $genderType ? $this->faker->firstNameFemale : $this->faker->firstNameMale,
            'last_name'  => $this->faker->lastName,
        ];
    }
}
