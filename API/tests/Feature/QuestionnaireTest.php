<?php

namespace Tests\Feature;

use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class QuestionnaireTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test index questionnaires route.
     *
     * @return void
     */
    public function testIndexQuestionnaire()
    {
        // $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->user
        );
        // get the questionnaire
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'api/questionnaire');
        // validate response code
        $response->assertStatus(200);
        // dd($response->getContent());

        // validate expected data structure
        $response->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'sections',
            ],
        ]);
        // validate expected data
        $response->assertSee('PCA Assessment');
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
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'api/questionnaire/1');
        // validate response code
        $response->assertStatus(200);

        // debug stuff
        // dd($response->getContent());
        // file_put_contents('/usr/www/dme/pca_new.json', $response->getContent());

        // validate expected data structure
        $response->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'sections',
            ],
        ]);
        // validate expected data
        $response->assertSee('PCA Assessment');
    }

    protected function setUp(): void
    {
        parent::setUp();

        // seed the PCA assessment
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\PcaSeeder',
        ]);

        $this->user = User::factory()->create();
    }
}
