<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Payer;
use App\Models\Request;
use App\Models\RequestType;
use App\Models\RequestTypeDetail;
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
    private $route;

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
     * @todo Make the steps in this test seperate tests
     *
     * @return void
     */
    public function testRequestSectionAddressWithUpdate()
    {
        $requestId = $this->getRequest();
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

        self::assertEquals('1112223333', $newRequest->member->mainPhone->number);

        /**
         * personal information verification, first step.
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
         * assessment 2nd step.
         */
        $response = $this->put($route, [
            'type_name'   => ' auth-id',
            'auth_number' => '1234',
        ]);
        $response->assertSuccessful();

        /**
         * diagnosis 3rd step.
         */
        $response = $this->put($route, [
            'type_name'         => 'diagnosis',
            'relevantDiagnosis' => [
                ['code' => '1234', 'description' => 'welcome'],
                ['code' => '4321', 'description' => 'emoclew'],
            ],
        ]);
        $response->assertSuccessful();

        // make sure that relevantDiagnosis actually saved in the database
        self::assertCount(2, $newRequest->relevantDiagnoses);

        /**
         * due 5th and final step.
         */
        $response = $this->put($route, [
            'type_name' => 'due',
            'is_last'   => true,
            'due_at'    => $due_at = $this->faker->dateTimeBetween('now', '+2 weeks'),
        ]);
        $response->assertSuccessful();

        // Reload values from the database and make sure the last pieces were updated
        $memberRequest->refresh();

        self::assertEquals('Received', $memberRequest->statusName);
        self::assertEquals($due_at, $memberRequest->due_at);
    }

    /**
     * Test update request items.
     * @group   request
     *
     * @return void
     */
    public function testUpdateRequestItems()
    {
        $this->withoutExceptionHandling();
        $requestId = $this->getRequest();
        $route = route('api.request.update', [
            'request' => $requestId,
        ]);

        // missing request items, should fail with error
        $response = $this->put($route, [
            'type_name' => 'request-items',
        ]);

        $response->assertStatus(422);
        $response->assertJsonStructure(['errors']);

        // invalid request items, should fail with error
        $response = $this->put($route, [
            'type_name'       => 'request-items',
            'request_details' => ['one', 'two', 'three'],
        ]);

        $response->assertStatus(422);
        $response->assertJsonStructure(['errors']);

        // create some valid request types
        $requestTypes = RequestType::factory()->hasRequestTypeDetails(10)
            ->count(3)
            ->create(['payer_id' => $this->payer]);
        // get an array of params from the default request types
        $params = $requestTypes
            ->first()
            ->requestTypeDetails
            ->where('is_default', true)
            ->map(fn ($type) => $type->id)->values()->all();

        // send valid request type details
        $response = $this->put($route, [
            'type_name'            => 'request-items',
            'request_type_details' => [$params],
        ]);
        $response->assertSuccessful();
        // verify data
        $data = $response->json();
        // dd($data['request_items'], $params);
        $this->assertEquals(1, count($data['request_items']));
        // check that the request item details are the same ones that were passed in params
        $this->assertEquals($params, array_keys($data['request_items'][0]['details']));
    }

    protected function getRequest()
    {
        $response = $this->post($this->route);

        return $response->json('id');
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\RequestTypeSeeder',
        ]);
        $this->payer = Payer::factory()->hasLobs(5, ['is_tat_enabled' => 1])->count(1)->create()->first();

        $this->member = Member::factory()->hasAddresses(1, ['is_primary' => true])->create(['payer_id' => $this->payer]);
        $this->route = route('api.member.member-requests.store', [
            'member' => $this->member->uuid,
        ]);
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
