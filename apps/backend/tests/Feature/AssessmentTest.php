<?php

namespace Tests\Feature;

use App\Models\Request;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Spatie\Tags\Tag;
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
                'media_tags',
            ])
            ->assertJsonCount(Tag::getWithType('media')->count(), 'media_tags');
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\MediaTagSeeder',
        ]);

        $this->request = Request::factory()->create();
        $this->user = User::factory()->create(['user_type' => 3, 'primary_role' => 'field_clinican']);
        Passport::actingAs(
            $this->user
        );
    }
}
