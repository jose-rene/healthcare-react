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
        $title = 'Favorites Assessment';
        if (null !== Questionnaire::firstWhere(['title' => $title])) {
            return;
        }
        $faker = Faker::create();
        // seed a simple one section form
        $colorlist = Valuelist::create([
            'title' => 'Favorite Colors',
        ]);
        $values = [
            Listitem::create([
                'title' => 'Select a Color',
                'val'   => '',
            ]),
        ];
        for ($xx = 0; $xx <= 5; $xx++) {
            $values[] = Listitem::create([
                'title' => $color = $faker->unique()->colorName,
                'val'   => $color,
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
                'val'   => '',
            ]),
        ];
        for ($xx = 0; $xx <= 5; $xx++) {
            $values[] = Listitem::create([
                'title' => $number = $faker->unique()->randomDigit,
                'val'   => $number,
            ]);
        }
        $numberlist->listitems()->saveMany($values);
        // questions
        $naQuestion = Question::create([
            'title'         => 'N/A',
            'name'          => 'fave_na',
            'position'      => 0,
            'required'      => false,
            'ele_type'      => 'checkbox',
            'question_type' => 'na_toggle',
        ]);
        $colorQuestion = Question::create([
            'title'    => 'What is your favorite color?',
            'name'     => 'fave_color',
            'position' => 2,
            'required' => true,
            'ele_type' => 'select',
        ]);
        $colorQuestion->valuelist()->associate($colorlist)->save();
        // another question
        $numberQuestion = Question::create([
            'title'    => 'What is your favorite number?',
            'name'     => 'fave_number',
            'position' => 3,
            'required' => true,
            'ele_type' => 'select',
        ]);
        $numberQuestion->valuelist()->associate($numberlist)->save();
        $nameQuestion = Question::create([
            'title'    => 'What is your name?',
            'name'     => 'name',
            'position' => 1,
            'required' => true,
            'ele_type' => 'text',
        ]);
        // create the section
        $section = Section::create([
            'name'     => 'favorites',
            'title'    => 'Your Favorites',
            'position' => 2,
        ]);
        $section->questions()->saveMany([$naQuestion, $colorQuestion, $numberQuestion, $nameQuestion]);
        $sectionComments = Section::create([
            'name'     => 'comments',
            'title'    => 'Comments',
            'position' => 1,
        ]);
        $comments = Question::create([
            'title'    => 'Comments',
            'name'     => 'comments',
            'position' => 1,
            'required' => false,
            'ele_type' => 'textarea',
        ]);
        $sectionComments->questions()->save($comments);
        // create questionnaire
        $questionnaire = Questionnaire::create([
            'title' => $title,
        ]);
        // save sections
        $questionnaire->sections()->saveMany([$section, $sectionComments]);
    }
}
