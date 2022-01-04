<?php

namespace Tests\Feature;

use App\Models\Activity\Activity;
use App\Models\Request;
use App\Models\User;
use App\Notifications\RequestActivity;
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
        $response
            ->assertJsonStructure(['data'])
            ->assertJsonCount($this->request->activities->count(), 'data');

        // if we don't send a request id and the user doesn't have perms validate empty response
        $response = $this->json('GET', $route = route('api.activity.index'));
        // validate response code
        $response
            ->assertStatus(200)
            ->assertExactJson([]);
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
            ->assertJsonStructure([
                'id',
                'parent_id',
                'date',
                'datetime',
                'priority',
                'message',
                'type',
                'activities', 
            ])
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

        $activity = $response->json();

        // verify activity exists for request
        $response = $this->json('GET', route('api.request.show', $this->request));
        $activityIds = collect($response->json()['activities'])->map(fn($item) => $item['id'])->toArray();
        $this->assertContains($activity['id'], $activityIds);
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

    /**
     * Test notification generation from created activity.
     *
     * @return void
     */
    public function testNotification()
    {
        // a notification will be generated on activity creation, use notification fake
        Notification::fake();

        $formData = $this->getFormData();
        $response = $this->json('POST', route('api.activity.store'), $formData);
        // validate data
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['id', 'message', 'type', 'activities'])
            ->assertJsonPath('message', $formData['message'])
            ->assertJsonPath('priority', $formData['priority'])
            ->assertJsonPath('user_id', $this->user->id);

        // notification sent to user
        Notification::assertSentTo($this->user, RequestActivity::class);
    }

    /**
     * Test create notification index list.
     *
     * @return void
     */
    public function testNotificationIndex()
    {
        $formData = $this->getFormData();
        $response = $this->json('POST', route('api.activity.store'), $formData);
        // validate data
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['id', 'message', 'type', 'activities'])
            ->assertJsonPath('message', $formData['message'])
            ->assertJsonPath('priority', $formData['priority'])
            ->assertJsonPath('user_id', $this->user->id);

        // get notifications
        $response = $this->json('GET', route('api.notifications.index'));
        $response
            ->assertSuccessful()
            ->assertJsonPath('0.message', $formData['message']);
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
