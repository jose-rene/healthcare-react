<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Passport;
use Tests\TestCase;

class RequestAddTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * @var User
     */
    private $user;
    private Member $member;

    /**
     * Act like I'm submitting a new request for a member.
     *
     * @group request
     *
     * @return void
     */
    public function testRequestPost()
    {
        $route = route('api.member.member-requests.store', [
            'member' => $this->member->uuid,
        ]);

        $response = $this->post($route);

        $memberRequest = Request::first();

        $response
            ->assertSuccessful()
            ->assertJsonStructure(['id', 'member'])
            ->assertJson(['id' => $memberRequest->uuid]);
    }

    /**
     * Act like I'm submitting a new request for a member.
     * @depends testRequestPost
     * @group   request
     *
     * @return void
     */
    public function testRequestSections()
    {
        $this->withoutExceptionHandling();
        $route = route('api.member.member-requests.store', [
            'member' => $this->member->uuid,
        ]);

        $response = $this->post($route);
        $response->assertJsonPath('payer.id', $this->member->payer->uuid);
        $requestId = $response->json('id');

        /** @var Request $newRequest */
        $newRequest = Request::where('uuid', $requestId)->first();
        self::assertEquals($requestId, $newRequest->uuid);

        $route = route('api.request.update', [
            'request' => $requestId,
        ]);

        /**
         * assessment 1st step.
         */
        $response = $this->put($route, ['type_name' => 'verify']);
        $response
            ->assertSuccessful()
            ->assertJsonStructure(['member_verified'])
            ->assertJsonPath('member_verified', true);

        /**
         * assessment 2nd step.
         */
        $response = $this->put($route, [
            'type_name'   => 'auth-id',
            'auth_number' => $authNumber = '1234',
        ]);
        $response->assertSuccessful()
            ->assertJsonStructure(['auth_number'])
            ->assertJsonPath('auth_number', $authNumber);

        /**
         * diagnosis 3rd step.
         */
        $response = $this->put($route, [
            'type_name' => 'diagnosis',

            'relevantDiagnosis' => [
                ['code' => '1234', 'description' => 'welcome'],
                ['code' => '4321', 'description' => 'emoclew'],
            ],
        ]);
        $response->assertSuccessful();

        // make sure that relevantDiagnosis actually saved in the database
        self::assertCount(2, $newRequest->relevantDiagnoses);

        /**
         * due 4th and final step.
         */
        $response = $this->put($route, [
            'type_name' => 'due',
            'is_last'   => true,
            'due_at'    => $due_at = $this->faker->dateTimeBetween('now', '+2 weeks'),
        ]);
        $response->assertSuccessful();

        // Load from the database and make sure the last pieces were updated
        $memberRequest = Request::firstWhere('member_id', $this->member->id);

        self::assertEquals('Received', $memberRequest->statusName);
        self::assertEquals($due_at, $memberRequest->due_at);
    }

    public function testUniqueAuthNumber()
    {
        // $this->withoutExceptionHandling();
        // create a random previous request, not the same payer
        $anyRequest = Request::factory()->create();
        $this->assertNotEquals($this->member->payer->id, $anyRequest->payer->id);

        // create a previous request for the same payer
        $previousRequest = Request::factory()->create(['payer_id' => $this->member->payer]);
        $this->assertEquals($this->member->payer->id, $previousRequest->payer->id);

        // get the a new request for the member
        $route = route('api.member.member-requests.store', [
            'member' => $this->member->uuid,
        ]);

        $response = $this->post($route);
        $response->assertJsonPath('payer.id', $this->member->payer->uuid);
        $requestId = $response->json('id');

        // update request route
        $route = route('api.request.update', [
            'request' => $requestId,
        ]);

        // use an auth number from an unrelated plan, should pass
        $response = $this->put($route, [
            'type_name'   => 'auth-id',
            'auth_number' => $anyRequest->auth_number,
        ]);
        $response->assertSuccessful()
            ->assertJsonStructure(['auth_number'])
            ->assertJsonPath('auth_number', $anyRequest->auth_number);

        // use an auth number from an related plan, should fail validation
        $response = $this->put($route, [
            'type_name'   => 'auth-id',
            'auth_number' => $previousRequest->auth_number,
        ]);
        $response->assertStatus(422);
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('passport:install');

        $this->member = Member::factory()->hasAddresses(1, ['is_primary' => true])->create();
        // this will store a new user with random attributes in the database.
        /* @var User $user */
        $this->user = User::factory(['password' => Hash::make('password')])->create();
        $this->user->assign('admin');

        Bouncer::allow('admin')->to('*');

        Passport::actingAs(
            $this->user
        );
    }
}
