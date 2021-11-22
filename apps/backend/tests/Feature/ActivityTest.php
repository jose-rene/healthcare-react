<?php

namespace Tests\Feature;

use App\Models\Activity\Activity;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Notification;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase, WithFaker;

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
        // dd($response->json());
        $response->assertJsonStructure(['id', 'message', 'type', 'activities']);
        // validate data
        $response
            ->assertOk()
            ->assertJsonPath('id', $this->activity->uuid)
            ->assertJsonCount(3, 'activities')
            ->assertJsonCount(2, 'activities.0.activities');
    
    }

    /**
     * Test create activity.
     *
     * @return void
     */
    public function testCreateActivity()
    {
        $formData = $this->getFormData();
        $response = $this->json('POST', route('api.activity.store'), $formData);
        // validate data
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['id', 'message', 'type', 'activities'])
            ->assertJsonPath('message', $formData['message'])
            ->assertJsonPath('priority', $formData['priority']);
    }

    /**
     * Test create activity reply.
     *
     * @return void
     */
    public function testActivityReply()
    {
        $formData = $this->getFormData();
        $activity = Activity::first();
        // add a parent id for reply
        $formData['parent_id'] = $activity->id;

        $response = $this->json('POST', route('api.activity.store'), $formData);
        // validate data
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['id', 'message', 'type', 'activities'])
            ->assertJsonPath('message', $formData['message'])
            ->assertJsonPath('priority', $formData['priority'])
            ->assertJsonPath('parent_id', $activity->uuid);
        
        $data = $response->json();
        // get the parent activity and check child acitivity
        $response = $this->json('GET', route('api.activity.show', ['activity' => $activity]), $formData);
        // validate response
        $response
            ->assertOk()
            ->assertJsonStructure(['id', 'message', 'type', 'activities'])
            ->assertJsonPath('message', $activity->message)
            ->assertJsonPath('parent_id', null)
            ->assertJsonPath('activities.0.id', $data['id']);
    }

    protected function getFormData()
    {
        return [
            'request_id'   => $this->request->uuid,
            'notify_admin' => 1,
            'user_id'      => $this->user->id,
            'priority'     => true,
            'message'      => $this->faker->sentence,
        ];
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

        // children of children, make 2 each
        $this->activity->children->each(fn($item) => $item->children()->saveMany(Activity::factory()->forUser()->count(2)->create()));
        $this->user = User::factory()->create();
        Passport::actingAs(
            $this->user
        );
    }
}
