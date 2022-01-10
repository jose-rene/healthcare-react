<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Lob;
use App\Models\Member;
use App\Models\Payer;
use App\Models\Request;
use App\Models\RequestType;
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
    public function testRequestSectionSteps()
    {
        $this->withoutExceptionHandling();
        $requestId = $this->getRequest();
        /** @var Request $newRequest */
        $newRequest = Request::where('uuid', $requestId)->first();
        self::assertEquals($requestId, $newRequest->uuid);

        $route = route('api.request.update', [
            'request' => $requestId,
        ]);

        // test step 1 verify / update member
        $newAddress = Address::factory()->make()->only('address_1', 'city', 'county', 'state', 'postal_code');
        $response = $this->put($route, $params = [
            'type_name'        => 'verify',
            'address'          => $newAddress,
            'phone'            => $this->faker->phoneNumber,
            'member_number'    => $this->faker->ean8,
            'plan'             => Payer::factory()->create()->uuid,
            'line_of_business' => Lob::factory()->create()->id,
        ]);
        $response->assertSuccessful();
        // verify that data was updated
        $response->assertJsonPath('member.address.address_1', $newAddress['address_1']);
        $response->assertJsonPath('member.phone.number', $params['phone']);
        $response->assertJsonPath('member.member_number', $params['member_number']);
        $response->assertJsonPath('member.lob.id', $params['line_of_business']);
        $response->assertJsonPath('member.payer.id', $params['plan']);

        /**
         * assessment 2nd step.
         */
        $response = $this->put($route, $params = [
            'type_name'   => ' auth-id',
            'auth_number' => '1234',
        ]);
        $response->assertSuccessful();
        $response->assertJsonPath('auth_number', $params['auth_number']);

        /**
         * diagnosis 3rd step.
         */
        $response = $this->put($route, $params = [
            'type_name' => 'diagnosis',
            'codes'     => [
                ['code' => '1234', 'description' => 'welcome'],
                ['code' => '4321', 'description' => 'emoclew'],
                ['code' => '5555', 'description' => 'helloworld'],
            ],
        ]);
        $response->assertSuccessful();
        // make sure that relevantDiagnosis actually saved in the database
        $response->assertJsonCount(count($params['codes']), 'codes');
        // verify values
        foreach ($params['codes'] as $key => $code) {
            $response->assertJsonPath('codes.' . $key . '.code', $code['code']);
        }

        // this should update the first two and remove the 2nd
        $response = $this->put($route, $params = [
            'type_name' => 'diagnosis',
            'codes'     => [
                ['code' => '1233', 'description' => 'welcome'],
                ['code' => '3321', 'description' => 'emoclew'],
            ],
        ]);
        $response->assertSuccessful();
        // verify extraneous code was removed
        $response->assertJsonCount(count($params['codes']), 'codes');
        // verify updated values
        foreach ($params['codes'] as $key => $code) {
            $response->assertJsonPath('codes.' . $key . '.code', $code['code']);
        }

        /**
         * due 5th and final step.
         */
        $response = $this->put($route, [
            'type_name' => 'due',
            'due_at'    => $due_at = $this->faker->dateTimeBetween('+1 day', '+2 weeks'),
        ]);
        $response->assertSuccessful();

        // Load values from the database and make sure the last pieces were updated
        $memberRequest = Request::with('member.addresses')->first();
        self::assertEquals($due_at, $memberRequest->due_at);
        self::assertSame(false, $memberRequest->due_at_na);

        // final submission
        $response = $this->put($route, [
            'type_name' => 'submit',
        ]);
        $response->assertSuccessful();

        // Load values from the database and make sure the last pieces were updated
        $memberRequest = Request::with('member.addresses')->first();

        self::assertEquals('Received', $memberRequest->statusName);
    }

    /**
     * Test update request items.
     * @group   request
     *
     * @return void
     */
    public function testUpdateRequestItems()
    {
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

        // make sure at least one of the request type details is default
        $params = $requestTypes
            ->first()
            ->requestTypeDetails
            ->first()
            ->update(['is_default' => true]);

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
        // dd($params, $data['request_items'][0]['details']);
        $this->assertEquals(1, count($data['request_items']));
        $requestDetailIds = collect($data['request_items'][0]['details'])->map(fn ($item) => $item['id'])->toArray();
        // check that the request item details are the same ones that were passed in params
        $this->assertEquals($params, $requestDetailIds);
    }

    /**
     * Test no documents added.
     * @group request
     *
     * @return void
     */
    public function testNoDocuments()
    {
        $requestId = $this->getRequest();
        $route = route('api.request.update', [
            'request' => $requestId,
        ]);

        // missing reason, should fail with error
        $response = $this->put($route, [
            'type_name' => 'no-documents',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors']);

        // add reason
        $response = $this->put($route, [
            'type_name'        => 'no-documents',
            'documents_reason' => $reason = 'The dog ate it.',
        ]);

        // verify success
        $response
            ->assertSuccessful()
            ->assertJsonPath('documents_reason', $reason)
            ->assertJsonPath('documents_na', true);
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
