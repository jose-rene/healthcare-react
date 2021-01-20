<?php

namespace Database\Seeders;

use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use App\Models\Request;
use App\Models\User;
use Illuminate\Database\Seeder;

class AssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(QuestionnaireSeeder::class);
        $this->call(RequestSeeder::class);
        $title = 'Favorites Assessment';

        Assessment::firstOrCreate(['id' => 1], [
            'request_id'       => Request::firstWhere(['id' => 1])->id,
            'questionnaire_id' => Questionnaire::firstWhere(['title' => $title])->id,
            'user_id'          => User::firstWhere(['email' => 'Skylar.Langdon@dme-cg.com'])->id,
        ]);
    }
}
