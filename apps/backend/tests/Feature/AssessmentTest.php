<?php

namespace Tests\Feature;

use App\Models\Assessment\Questionnaire;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $request;
    protected $questionnaire;

    /**
     * Test validating and entering assessment.
     *
     * @return void
     */
    public function testEnterAssessment()
    {
        // $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->user
        );
        // get the questionnaire
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/questionnaire/' . $this->questionnaire->uuid);
        // validate response code
        $response->assertStatus(200);
        $data = json_decode($response->getContent(), true);

        $input = ['questionnaire_id' => $this->questionnaire->id, 'request_id' => $this->request->id];
        // find a valid valuelist entry for question answer
        $formData = $this->getValidInput($data);
        $input = array_replace($input, $formData);

        // send request to store with one required answer
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('POST', 'v1/assessment', $input);
        // validate response code
        $response->assertStatus(200);
        $response->assertJson(['data' => $formData]);
        // verify it shows two errors for the seeded test questionnaire
        $response->assertJsonCount(2, 'errors');
        // remove questionnaire id that's not a part on the validated data
        unset($input['questionnaire_id'], $input['request_id']);
        // verify success
        $response->assertJson(['success' => 1]);
        // get response data
        $data = json_decode($response->getContent(), true);

        // fetch the created assessment
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/assessment/' . $data['id']);
        $response->assertStatus(200);
        $response->assertJsonStructure(['id', 'questionnaire', 'answers']);
    }

    /**
     * Test validating and updating assessment.
     *
     * @return void
     */
    public function testSaveAssessment()
    {
        Passport::actingAs(
            $this->user
        );
        // insert an assessment
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/questionnaire/' . $this->questionnaire->uuid);
        $response->assertStatus(200);
        $questionnaireData = json_decode($response->getContent(), true);
        // dd($questionnaireData);
        $input = ['questionnaire_id' => $this->questionnaire->id, 'request_id' => $this->request->id];
        // find a valid valuelist entry for question answer
        $formData = $this->getValidInput($questionnaireData);
        $input = array_replace($input, $formData);
        // send request to save one required answer
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('POST', 'v1/assessment', $input);
        $response->assertStatus(200);
        // get response data
        $data = json_decode($response->getContent(), true);
        // fetch the created assessment
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/assessment/' . $data['id']);
        $response->assertStatus(200);
        $data = json_decode($response->getContent(), true);

        // update assessment with new anwser
        $input = $this->getValidInput($questionnaireData);
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('PUT', 'v1/assessment/' . $data['id'], $input);
        // dd($response->getContent());
        $response->assertStatus(200);
        $response->assertJson(['data' => $input]);

        // update answer with blank answer
        $inputNada = array_map(function ($item) {
            return '';
        }, $input);

        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('PUT', 'v1/assessment/' . $data['id'], $inputNada);
        // dd($response->getContent());
        $response->assertStatus(200);
        $response->assertJson(['data' => []]);

        // verify answer set to blank value persists
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/assessment/' . $data['id']);
        $response->assertStatus(200);
        $data = json_decode($response->getContent(), true);
        $answers = array_map(function ($item) {
            return $item['value'];
        }, $data['answers']);

        // dd($answers, $input, $inputNada);
        // make sure answer is set to blank
        $valid = array_filter($answers);
        $this->assertEmpty($valid);
    }

    /**
     * Get a valid valuelist input parameter.
     *
     * @param array $data
     * @param array $input
     *
     * @return array $input
     */
    protected function getValidInput(array $data, array $input = []) :array
    {
        foreach ($data['sections'] as $section) {
            foreach ($section['questions'] as $question) {
                if (isset($question['valuelist'])) {
                    // dd($question['valuelist']['listitems'][1]);
                    $input['input_' . $question['id']] = $question['valuelist']['listitems'][1]['val'];
                    break 2;
                }
            }
        }

        return $input;
    }

    protected function setUp(): void
    {
        parent::setUp();

        // seed the test assessment
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\QuestionnaireSeeder',
        ]);

        $this->questionnaire = Questionnaire::all()->first();
        $this->user = User::factory()->create();
        $this->request = Request::factory()->create();
    }
}
