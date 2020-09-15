<?php

namespace Database\Seeders;

use App\Models\Assessment\Question;
use App\Models\Assessment\Questionnaire;
use App\Models\Assessment\Section;
use App\Models\Assessment\Valuelist\Listitem;
use App\Models\Assessment\Valuelist\Valuelist;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class QuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        // seed a simple one section form
        $colorlist = Valuelist::create([
            'title' => 'Favorite Colors',
        ]);
        $values = [
            Listitem::create([
                'title' => 'Select a Color',
                'val' => '',
            ]),
        ];
        for ($xx = 0; $xx <= 5; $xx++) {
            $values[] = Listitem::create([
                'title' => $color = $faker->unique()->colorName,
                'val' => $color,
            ]);
        }
        $colorlist->listitems()->saveMany($values);
        // another valuelist
        $numberlist = Valuelist::create([
            'title' => 'Favorite Numbers',
        ]);
        $values = [
            Listitem::create([
                'title' => 'Select a Number',
                'val' => '',
            ]),
        ];
        for ($xx = 0; $xx <= 5; $xx++) {
            $values[] = Listitem::create([
                'title' => $number = $faker->unique()->randomDigit,
                'val' => $number,
            ]);
        }
        $numberlist->listitems()->saveMany($values);
        // questions
        $colorQuestion = Question::create([
            'title' => 'What is you favorite color?',
            'name' => 'fave_color',
            'position' => 1,
            'required' => true,
            'ele_type' => 'select',
        ])->valuelist()->associate($colorlist)->save();
        // another question
        $numberQuestion = Question::create([
            'title' => 'What is you favorite number?',
            'name' => 'fave_number',
            'position' => 1,
            'required' => true,
            'ele_type' => 'select',
        ])->valuelist()->associate($numberlist)->save();
        // create the section
        $section = Section::create([
            'name' => 'favorites',
            'title' => 'Your Favorites',
            'position' => 1,
        ]);
        // create questionnaire
        $questionnaire = Questionnaire::create([
            'title' => 'Favorites Assessment',
        ]);
        // save sections
        $questionnaire->sections()->saveMany([$section]);
    }
}
