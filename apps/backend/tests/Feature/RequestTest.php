<?php

namespace Tests\Feature;

use App\Models\Request;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use App\Notifications\AssignedNotification;
use Artisan;
use Bouncer;
use Database\Seeders\HealthPlanUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
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
        $response = $this->json('GET', 'v1/request/' . $this->request->id);
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
        $response = $this->json('GET', 'v1/request/' . $this->request->uuid);
        // dd($response->json());
        // validate response code
        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'member'])
            ->assertJson(['id' => $this->request->uuid]);
    }

    /**
     * Test request summary.
     *
     * @return void
     */
    public function testRouteSummary()
    {
        Passport::actingAs(
            $this->user
        );
        // get the request summary for user
        $response = $this->get('v1/request/summary');
        // validate response code and structure
        $response
            ->assertOk()
            ->assertJsonStructure([
                'new',
                'assigned',
                'scheduled',
                'submitted',
            ]); // this health plan user only has one new request
    }

    /**
     * Test request my stuff filter.
     *
     * @return void
     */
    public function testRequestFilter()
    {
        Passport::actingAs(
            $this->user
        );
        // get the request by id, should fail
        $response = $this->json('GET', route('api.request.index'));
        // validate response code
        $response
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // add the my stuff filter, should get no results since this user is not the user for the request
        $response = $this->json('GET', route('api.request.index', ['filter' => '1']));
        // validate response code
        $response
            ->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /**
     * Test reviewer manager access.
     *
     * @return void
     */
    public function testReviewerManager()
    {
        $reviewer = User::factory()->create(['user_type' => 3, 'primary_role' => 'reviewer_manager']);
        Bouncer::sync($this->clinician)->roles(['reviewer_manager']);
        Passport::actingAs($reviewer);
        // should get the tests requests, can access all
        $response = $this->json('GET', route('api.request.index'));
        // validate response code and that all requests are shown
        $response
            ->assertStatus(200)
            ->assertJsonCount(Request::all()->count(), 'data');
    }

    /**
     * Test request assign.
     *
     * @return void
     */
    public function testRequestAssign()
    {
        // access with admin user
        Passport::actingAs(
            $this->admin
        );
        // a notification will be generated when clinician is assigned
        Notification::fake();
        // assign the therapist
        $response = $this->json('PUT', route('api.request.assign', ['request' => $this->request]),
            ['clinician_id' => $this->clinician->uuid]
        );
        // dd($response->json());
        // validate response code
        $response
            ->assertStatus(200)
            ->assertJsonPath('clinician.id', $this->clinician->id);

        // notification sent to user
        Notification::assertSentTo($this->clinician, AssignedNotification::class);
    }

    /**
     * Test request assigned notification.
     *
     * @return void
     */
    public function testAssignedNotification()
    {
        $this->withoutExceptionHandling();
        // access with admin user
        Passport::actingAs(
            $this->admin
        );
        // assign the therapist
        $response = $this->json('PUT', route('api.request.assign', ['request' => $this->request]),
            ['clinician_id' => $this->clinician->uuid]
        );
        // dd($response->json());
        // validate response code
        $response
            ->assertStatus(200)
            ->assertJsonPath('clinician.id', $this->clinician->id);

        // verify notification saved to db, get notifications
        Passport::actingAs(
            $this->clinician
        );
        $response = $this->json('GET', route('api.notifications.index'));
        // validate response
        $response
            ->assertSuccessful()
            ->assertJsonPath('0.request_id', $this->request->uuid)
            ->assertJsonPath('0.action.title', 'View Request')
            ->assertJsonPath('0.action.url', '/assessment/' . $this->request->uuid);
    }

    protected function setUp(): void
    {
        parent::setUp();
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        // set up the users
        $this->admin = User::factory()->create(['user_type' => 4, 'primary_role' => 'client_services_specialist']);
        Bouncer::sync($this->admin)->roles(['client_services_specialist']);
        $this->clinician = User::factory()->create(['user_type' => 3, 'primary_role' => 'field_clinician']);
        Bouncer::sync($this->clinician)->roles(['field_clinician']);
        // make a test request and healthplan user
        $this->request = Request::factory()->create();
        $this->user = User::factory()->hasHealthPlanUser(1, ['payer_id' => $this->request->payer->id])->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        Bouncer::sync($this->user)->roles(['hp_user']);
    }
}
