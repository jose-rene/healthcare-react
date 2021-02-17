<?php

namespace Tests\Feature;

use App\Models\Activity\Activity;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    protected $activity;
    protected $request;
    protected $user;

    /**
     * Test fetching member.
     *
     * @return void
     */
    public function testGetActivity()
    {
        $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->user
        );
        // get the activity
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/activity/' . $this->activity->uuid);
        // validate response code
        $response->assertStatus(200);
        // validate structure
        // dd($response->getContent());
        $response->assertJsonStructure(['id', 'message', 'type', 'children']);
        // validate data
        $data = json_decode($response->getContent(), true);
        // id is the uuid
        $this->assertEquals($data['id'], $this->activity->uuid);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');

        // a notification will be generated on activity creation, use notification fake
        Notification::fake();
        $this->request = Request::factory()->create();

        // Generate activity with children for the automated tests
        $this->activity = Activity::factory()
            ->forUser()
            ->has(Activity::factory()->forUser()->count(3), 'children')
            ->create();

        $this->user = User::factory()->create();
    }
}
