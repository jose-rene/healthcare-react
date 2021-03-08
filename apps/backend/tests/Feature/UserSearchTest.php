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

    protected function setUp(): void
    {
        parent::setUp();
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        $this->manager = User::factory()->create();
        // assign hp manager role to user
        Bouncer::sync($this->manager)->roles(['hp_manager']);
        // add user type health plan
        $hpUser = HealthPlanUser::factory()->create();
        $this->manager->healthPlanUser()->save($hpUser);
        $this->manager->user_type = 2;
        $this->manager->save();
    }
}
