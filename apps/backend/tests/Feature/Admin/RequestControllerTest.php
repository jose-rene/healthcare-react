<?php

namespace Tests\Feature\Admin;

use App\Models\Request;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Database\Seeders\HealthPlanUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class
 * @link  https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link  https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 * @group admin
 */
class RequestControllerTest extends TestCase
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
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/request/' . $this->request->id);
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
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/request/' . $this->request->uuid);
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
        // generate some health plan users
        Artisan::call('db:seed', [
            '--class' => HealthPlanUserSeeder::class,
        ]);

        /**
         * get the first healthplan user
         */
        $hp   = HealthPlanUser::first();
        $user = $hp->payer->users()->first();

        // login
        Passport::actingAs($user);

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

    protected function setUp(): void
    {
        parent::setUp();

        Bouncer::allow('admin')->everything();

        $this->request = Request::factory()->create();
        $this->user    = User::factory()->create();

        Bouncer::sync($this->user)->roles(['admin']);
    }
}
