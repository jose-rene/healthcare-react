<?php

use App\Models\Assessment\Question;
use App\Models\Assessment\Questionnaire;
use App\Models\Assessment\Section;
use Illuminate\Database\Seeder;

class FactoryQuestionnaireSeeder extends Seeder
{
    /**
     * Generate some questionnaires and sections and questions with answers attached to each questionnaire
     * each data set generates a random count of data
     *
     * @return void
     */
    public function run()
    {
        // Generate the questionnaire to attach everything to
        factory(Questionnaire::class, random_int(1, 2))
            ->create()
            ->each(function (Questionnaire $questionnaire) {

                // Generate some question sections
                factory(Section::class, random_int(1, 3))
                    ->create(['questionnaire_id' => $questionnaire->id])
                    ->each(function (Section $section) {

                        // Generate questions
                        factory(Question::class)
                            ->create(['section_id' => $section->id])
                            ->each(function (Question $question) {

                                // Generate some values
                                // TODO :: this is not working ListItem is not a model. I'm not sure how to inject
                                // sample answers to the question
//                                factory(ListItem::class, random_int(2, 5))
//                                    ->create();

                            });
                    });
            });
    }
}
