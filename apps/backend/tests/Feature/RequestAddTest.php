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
     * Act like I'm submitting a new request for a member
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
     * Act like I'm submitting a new request for a member
     * @depends testRequestPost
     * @group   request
     *
     * @return void
     */
    public function testRequestSectionAddressWithUpdate()
    {
        $route = route('api.member.member-requests.store', [
            'member' => $this->member->uuid,
        ]);

        $response = $this->post($route);

        $requestId = $response->json('id');
        /** @var Request $newRequest */
        $newRequest = Request::where('uuid', $requestId)->first();
        self::assertEquals($requestId, $newRequest->uuid);

        $route = route('api.request.update', [
            'request' => $requestId,
        ]);

        $response = $this->put($route, [
            'type_name'     => 'verify',
            'phone'         => '1112223333',
            'member_number' => 'this was changed',
            'dob'           => '1984-12-20',
        ]);
        $response->assertSuccessful();

        self::assertEquals("1112223333", $newRequest->member->mainPhone->number);

        /**
         * personal information verification, first step
         */
        $newStreet = $this->faker->streetAddress . '.new';

        $response = $this->put($route, [
            'type_name' => 'verify',

            'address' => [
                'address_1' => $newStreet,
            ],
        ]);
        $response->assertSuccessful();

        $memberRequest = Request::with('member.addresses')->first();
        $memberAddress = $memberRequest->member->addresses()->first();
        self::assertEquals($newStreet, $memberAddress->address_1);

        /**
         * assessment 2nd step
         */
        $response = $this->put($route, [
            'type_name' => ' auth-id',

            'auth_number' => '1234',
        ]);
        $response->assertSuccessful();

        /**
         * diagnosis 3rd step
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
         * due 4th and final step
         */
        $response = $this->put($route, [
            'type_name' => 'due',
            'is_last'   => true,

            'due_at' => $due_at = $this->faker->dateTimeBetween('now', '+2 weeks'),
        ]);
        $response->assertSuccessful();

        // Reload values from the database and make sure the last pieces were updated
        $memberRequest->refresh();

        self::assertEquals('Received', $memberRequest->statusName);
        self::assertEquals($due_at, $memberRequest->due_at);
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
