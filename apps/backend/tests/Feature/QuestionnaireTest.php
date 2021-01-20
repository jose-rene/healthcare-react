<?php

namespace Tests\Feature;

use App\Models\Assessment\Questionnaire;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class QuestionnaireTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $questionnaire;

    /**
     * Test index questionnaires route.
     *
     * @return void
     */
    public function testIndexQuestionnaire()
    {
        $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->user
        );
        // get the questionnaire
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/questionnaire');
        // validate response code
        $response->assertStatus(200);
        // dd($response->getContent());

        // validate expected data structure
        $response->assertJsonStructure([
            'id',
            'title',
            'sections' => [],
        ]);
        // validate expected data
        $response->assertSee('Favorites Assessment');
    }

    /**
     * Test get questionnaire route.
     *
     * @return void
     */
    public function testGetQuestionnaire()
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

        // debug stuff
        // dd($response->getContent());
        // file_put_contents('/usr/www/dme/pca_resource.json', $response->getContent());

        // validate expected data structure
        $response->assertJsonStructure([
            'id',
            'title',
            'sections' => [],
        ]);
        // contains questions
        $response->assertJsonFragment(['id' => $this->questionnaire->uuid]);
        // validate expected data
        $response->assertSee('Favorites Assessment');
    }

    protected function setUp(): void
    {
        parent::setUp();

        // seed the PCA assessment
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\QuestionnaireSeeder',
        ]);

        $this->questionnaire = Questionnaire::first();
        $this->user = User::factory()->create();
    }
}
