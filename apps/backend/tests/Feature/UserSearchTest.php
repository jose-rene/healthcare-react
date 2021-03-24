<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class UserSearchTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $manager;

    /**
     * Test search health plan users.
     *
     * @return void
     */
    public function testSearchHealthPlanUser()
    {
        // create users to search
        // add admin user
        User::factory()->create(['user_type' => 1]);
        // add healthplan user
        User::factory()->create(['user_type' => 2]);

        Passport::actingAs(
            $this->manager
        );
        $response = $this->post('/v1/user/search');

        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);

        // there should be 2 results the hp manager and the user added
        $response->assertJsonPath('meta.total', 2);
    }

    /**
     * Test search health plan users.
     *
     * @return void
     */
    public function testSearchParam()
    {
        // create users to search
        // add admin user
        User::factory()->create(['user_type' => 1]);
        // add healthplan user
        $user = User::factory()->create(['user_type' => 2]);

        Passport::actingAs(
            $this->manager
        );
        // search by email address
        $response = $this->post('/v1/user/search', ['search' => $user->email, 'userSort' => 'last_name']);

        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);

        // there should be 1 result, the user added
        $response->assertJsonPath('meta.total', 1);
        $this->assertEquals($user->email, $response->json('data.0.email'));
    }

    protected function setUp(): void
    {
        parent::setUp();
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        $this->manager = User::factory()->create();
        // assign hp manager role to user
        Bouncer::sync($this->manager)->roles(['hp_champion']);
        // add user type health plan
        $hpUser = HealthPlanUser::factory()->create();
        $this->manager->healthPlanUser()->save($hpUser);
        $this->manager->user_type = 2;
        $this->manager->save();
    }
}
