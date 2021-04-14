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
        $gender        = $genderOptions[$genderType = rand(0, 1)];
        $titleOptions  = [['Mr.', 'Dr.', 'Sir'], ['Ms.', 'Mrs.', 'Miss.', 'Dr.']];
        $title         = $titleOptions[$genderType][rand(0, $genderType ? 3 : 2)];
        $payer         = Payer::factory()->hasLobs(5, ['is_tat_enabled' => 1])->count(1)->create()->first();

        return [
            'member_number'      => $this->faker->isbn10,
            'payer_id'           => $payer->id,
            'lob_id'             => $payer->lobs->first(),
            'member_number_type' => 'Member ID',
            'language'           => 'english',
            'gender'             => $gender,
            'name_title'         => $title,
            'first_name'         => $genderType ? $this->faker->firstNameFemale : $this->faker->firstNameMale,
            'last_name'          => $this->faker->lastName,
            'dob'                => new Carbon($this->faker->dateTimeBetween('-90 years', '-10 Years')),
        ];
    }
}
