<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Payer;
use Carbon\Carbon;
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
        $titleOptions = [['Mr.', 'Dr.', 'Sir'], ['Ms.', 'Mrs.', 'Miss.', 'Dr.']];
        $title = $titleOptions[$genderType][rand(0, $genderType ? 3 : 2)];

        return [
            'member_number' => $this->faker->isbn10,
            'payer_id'      => function () {
                return Payer::create(['name' => $this->faker->company]);
            },
            'member_id_type' => $this->faker->uuid, // @todo this is member id type id
            'language'       => 'english',
            'gender'         => $gender,
            'name_title'     => $title,
            'first_name'     => $genderType ? $this->faker->firstNameFemale : $this->faker->firstNameMale,
            'last_name'      => $this->faker->lastName,
            'dob'            => new Carbon($this->faker->dateTimeBetween('-90 years', '-10 Years')),
        ];
    }
}
