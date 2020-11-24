<?php

namespace Tests\Feature;

use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    /**
     * Test index questionnaires route.
     *
     * @return void
     */
    public function testSaveAssessment()
    {
        // $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->user
        );
        // get the questionnaire
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/questionnaire/1');
        // validate response code
        $response->assertStatus(200);
        // send request to save without required answers
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('POST', 'v1/assessment', ['questionnaire_id' => '1']);
        // validate response code
        // dd($response->getContent());
        $response->assertStatus(422);
        // verify it stops on first error
        $response->assertJsonCount(1, 'errors');
    }

    protected function setUp(): void
    {
        parent::setUp();

        // seed the test assessment
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\QuestionnaireSeeder',
        ]);

        $this->user = User::factory()->create();
    }
}
