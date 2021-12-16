<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class RequestSearchTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $member;
    protected $payer;
    protected $user;

    /**
     * Test sort requests.
     *
     * @return void
     */
    public function testMemberSort()
    {
        $search = [
            'perPage'           => 10,
            'sortColumn'        => 'member.name',
            'sortDirection'     => 'asc',
            'request_status_id' => 1,
        ];

        // get the first member sorted by last name
        $requestData = Request::all()->map(fn($item) => ['last_name' => $item['member']['last_name'], 'id' => $item['uuid']])
            ->sort()
            ->first();
        // search requests
        $response = $this->get(route('api.request.index', $search));

        // assert there are 5 requests sorted by member name
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'meta'])
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('data.0.id', $requestData['id'])
            ->assertJsonPath('data.0.member.last_name', $requestData['last_name']);
    }

    /**
     * Test sort requests.
     *
     * @return void
     */
    public function testPayerSort()
    {
        $search = [
            'perPage'           => 10,
            'sortColumn'        => 'payer.company_name',
            'sortDirection'     => 'asc',
            'request_status_id' => 1,
        ];

        // get the first payer sorted by name
        $requestData = Request::all()->map(fn($item) => ['company_name' => $item['payer']['name'], 'id' => $item['uuid']])->sort()->first();
        // search requests
        $response = $this->get(route('api.request.index', $search));

        // assert there are 5 requests sorted by company name
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'meta'])
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('data.0.id', $requestData['id'])
            ->assertJsonPath('data.0.payer.company_name', $requestData['company_name']);
    }

    /**
     * Test sort requests.
     *
     * @return void
     */
    public function testDefaultSortRequests()
    {
        $search = [
            'perPage'           => 50,
            'request_status_id' => 1,
            'sortColumn'        => '',
            'sortDirection'     => 'asc', // api should override to desc with no sort column
        ];

        // get the last reqeust sorted by last id
        $last = Request::all()->sortBy('id')->last();
        // search requests
        $response = $this->get(route('api.request.index', $search));

        // assert there are 5 requests sorted by request id desc
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'meta'])
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('data.0.id', $last->uuid);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the needed data
        Artisan::call('db:seed');
        // find a user
        $this->user = User::first();
        // make some requests
        Request::factory()->count(5)->create(['request_status_id' => 1, 'clinician_id' => $this->user->id]);
        Passport::actingAs(
            $this->user
        );
    }
}
