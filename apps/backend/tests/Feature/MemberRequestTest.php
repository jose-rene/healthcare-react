<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Request;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class MemberRequestTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $member;
    protected $user;

    /**
     * Test store member request.
     *
     * @return void
     */
    public function testMemberRequestStore()
    {
        $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->user
        );
        $response = $this->post('v1/member/' . $this->member->uuid . '/member-requests');
        // dd($response->json());
        $response->assertStatus(201);
    }

    /**
     * Test store member request.
     *
     * @return void
     */
    public function testMemberRequestUpdate()
    {
        Passport::actingAs(
            $this->user
        );
        $response = $this->post('v1/member/' . $this->member->uuid . '/member-requests');
        $response->assertStatus(201);

        // update with auth id
        $data   = $response->json();
        $update = $this->put('v1/member/' . $this->member->uuid . '/member-requests/' . $data['id'],
            ['auth_number' => $this->faker->isbn10]);
        $update->assertStatus(200);
    }

    /**
     * Test store member request.
     *
     * @return void
     */
    public function testUnrelatedRequestUpdate()
    {
        // $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->user
        );
        $response = $this->post('v1/member/' . $this->member->uuid . '/member-requests');
        $response->assertStatus(201);

        // update with an unrelated request
        $request = Request::factory()->create();
        $update  = $this->put('v1/member/' . $this->member->uuid . '/member-requests/' . $request->id,
            ['auth_number' => $this->faker->isbn10]);
        // the model binding will throw exception
        $update->assertStatus(404);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        // member
        $this->member = Member::factory()->hasAddresses(1)->count(1)->create()->first();
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());
        Bouncer::sync($this->user)->roles(['hp_user']);
        $this->user->save();
    }
}
