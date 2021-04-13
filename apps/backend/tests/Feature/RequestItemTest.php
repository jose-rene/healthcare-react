<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Request;
use App\Models\RequestType;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 */
class RequestItemTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    private $user;
    private $member;
    /**
     * @var mixed
     */
    private $requestUuid;

    /**
     * Make sure I can get back request types and a proper list of details
     *
     * @group requestTypes
     * @return void
     */
    public function testGettingTypes()
    {
        $types = RequestType::factory(5)
            ->hasTypeDetails(2)
            ->create();

        $response = $this->get(route('api.request.types.index'));

        $response
            ->assertOk()
            ->assertJsonCount($types->count());

        $firstResponseItem = $response->json('0');
        $rt                = RequestType::where('uuid', $firstResponseItem['id'])->first();
        self::assertCount(2, $rt->typeDetails);
    }

    /**
     * A basic feature test example.
     *
     * @group   requestTypes
     * @depends testGettingTypes
     * @return void
     */
    public function testAttachingItemAndItemDetailsTo()
    {
        $types = RequestType::factory(random_int(3, 10))
            ->hasTypeDetails(random_int(3, 10))
            ->create();

        $route = route('api.member-request.request-item.store', [
            'member_request' => $this->requestUuid,
        ]);

        $type = $types->first();

        $params = [
            'request' => [
                'request_items' => [
                    [
                        'name'                 => $type->name,
                        'id'                   => $type->uuid,
                        'request_item_details' => [
                            'name' => $type->typeDetails->first()->name,
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->post($route, $params);
        $response->assertSuccessful();

        /** @var Request $request */
        $request  = Request::where('uuid', $this->requestUuid)->first();
        $reqItems = $request->requestItems()->first();
        $reqItems->load(['itemDetails']);

        self::assertCount(1, $reqItems->itemDetails);
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');

        /* @var User $user */
        $this->user = User::factory(['password' => Hash::make('password')])->create();
        $this->user->assign('admin');

        $this->member = Member::factory()->hasAddresses(1, ['is_primary' => true])->create();


        Passport::actingAs(
            $this->user
        );

        // this will store a new user with random attributes in the database.
        $route = route('api.member.member-requests.store', [
            'member' => $this->member->uuid,
        ]);

        $response = $this->post($route);

        $this->requestUuid = $requestUuid = $response->json('id');
        /** @var Request $newRequest */
        $newRequest = Request::where('uuid', $requestUuid)->first();
        self::assertEquals($requestUuid, $newRequest->uuid);
    }
}
