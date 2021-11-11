<?php

namespace Tests\Feature;

use App\Models\Request;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Database\Seeders\HealthPlanUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected $request;
    protected $user;

    /**
     * Test assessment show.
     *
     * @return void
     */
    public function testAssessmentShow()
    {
        $response = $this->json('GET', route('api.request.assessment.show', ['request' => $this->request->uuid]));
        // validate response code and structure
        $response
            ->assertOk()
            ->assertJsonStructure([
                'member',
                'documents',
                'appt_reasons',
            ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->request = Request::factory()->create();
        $this->user = User::factory()->create(['user_type' => 3, 'primary_role' => 'field_clinican']);
        Passport::actingAs(
            $this->user
        );
    }
}
