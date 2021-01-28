<?php

namespace Tests\Feature;

use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class RequestTest extends TestCase
{
    use RefreshDatabase;

    protected $request;
    protected $user;

    /**
     * Test getting request by id.
     *
     * @return void
     */
    public function testRouteById()
    {
        Passport::actingAs(
            $this->user
        );
        // get the request by id, should fail
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/request/' . $this->request->id);
        // validate response code
        $response
            ->assertStatus(404)
            ->assertJsonStructure(['message']);
    }

    /**
     * Test getting request by uuid.
     *
     * @return void
     */
    public function testRouteByUuid()
    {
        Passport::actingAs(
            $this->user
        );
        // get the request by uuid
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/request/' . $this->request->uuid);
        // dd($response->getContent(), $this->request->toArray());
        // validate response code
        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'assessments'])
            ->assertJson(['id' => $this->request->uuid]);
    }

    /**
     * Test getting request by id.
     *
     * @return void
     */
    public function testRouteSummary()
    {
        Passport::actingAs(
            $this->user
        );
        // get the request summary for user
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/request/summary');
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'new',
                'in_progress',
                'scheduled',
                'submitted',
            ]);
    }

    protected function setUp(): void
    {
        parent::setUp();
        // seed a test questionnaire
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\QuestionnaireSeeder',
        ]);
        $questionnaire = Questionnaire::all()->first();

        $this->request = Request::factory()->create();
        $this->user = User::factory()->create();
        $this->assessment = new Assessment();
        $this->assessment->user()->associate($this->user);
        $this->assessment->request()->associate($this->request);
        $this->assessment->questionnaire()->associate($questionnaire);
        $this->assessment->save();
    }
}
