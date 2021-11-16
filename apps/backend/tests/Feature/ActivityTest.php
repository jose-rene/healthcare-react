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
     * Test activity index.
     *
     * @return void
     */
    public function testActivityIndex()
    {
        // get the activity
        $response = $this->json('GET', $route = route('api.activity.index', ['request_id' => $this->request]));
        // validate response code
        $response->assertStatus(200);
        // validate structure
        $response->assertJsonStructure(['data']);

        // if we don't send a request id and the user doesn't have perms validate empty response
        $response = $this->json('GET', $route = route('api.activity.index'));
        // validate response code
        $response->assertStatus(200);
        $response->assertExactJson([]);
    }

    /**
     * Test fetching activity.
     *
     * @return void
     */
    public function testGetActivity()
    {
        // get the activity
        $response = $this->json('GET', 'v1/activity/' . $this->activity->uuid);
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
        Passport::actingAs(
            $this->user
        );
    }
}
