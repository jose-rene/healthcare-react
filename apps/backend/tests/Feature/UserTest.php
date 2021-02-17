<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserType\EngineeringUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $user;
    protected $admin;

    /**
     * Test profile route.
     *
     * @return void
     */
    public function testProfile()
    {
        Passport::actingAs(
            $this->user
        );
        // fetch the user profile
        $response = $this->get('/v1/user/profile');

        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email']);

        $this->assertEquals($this->user->email, $response->json('email'));
    }

    /**
     * Test retrieve user.
     *
     * @return void
     */
    public function testRetrieve()
    {
        Passport::actingAs(
            $this->admin
        );
        // fetch the user profile
        $response = $this->get('/v1/user/' . $this->user->uuid);
        // will have the field gitlab_name for an engineering user
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'gitlab_name', 'roles']);

        $this->assertEquals($this->user->email, $response->json('email'));
    }

    /**
     * Test create user.
     *
     * @return void
     */
    public function testCreate()
    {
        Passport::actingAs(
            $this->admin
        );
        $formData = [
            'first_name' => $this->faker->firstName,
            'last_name'  => $this->faker->lastName,
            'email'      => $this->faker->unique()->safeEmail,
            'password'   => str_pad(preg_replace('~[^a-zA-Z0-9!_:\~#@\^\*\.\,\(\)\{\}\[\]\+\-\$]~', '', $this->faker->password), 8, '!'),
            'phone'      => $this->faker->phoneNumber,
        ];
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'roles']);

        $this->assertEquals($formData['email'], $response->json('email'));
    }

    /**
     * Test create user error.
     *
     * @return void
     */
    public function testCreateFail()
    {
        Passport::actingAs(
            $this->admin
        );
        // leave out password
        $badData = [
            'first_name' => $this->faker->firstName,
            'last_name'  => $this->faker->lastName,
            'email'      => $this->faker->unique()->safeEmail,
            'phone'      => $this->faker->phoneNumber,
        ];
        // create the user with data
        $response = $this->post('/v1/user', $badData);
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['password']]);
    }

    /**
     * Test update user.
     *
     * @return void
     */
    public function testUpdate()
    {
        Passport::actingAs(
            $this->admin
        );
        $formData = [
            'first_name' => $this->faker->firstName,
            'last_name'  => $this->faker->lastName,
        ];
        // update user with data
        $response = $this->put('/v1/user/' . $this->user->uuid, $formData);
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'roles']);

        $this->assertEquals($formData['last_name'], $response->json('last_name'));
    }

    /**
     * Test retrieve user.
     *
     * @return void
     */
    public function testDelete()
    {
        Passport::actingAs(
            $this->admin
        );
        // fetch the user profile
        $response = $this->delete('/v1/user/' . $this->user->uuid);
        $response
            ->assertOk()
            ->assertJsonStructure(['message'])
            ->assertSee($this->user->email);

        // verfiy user has been deleted
        $response = $this->get('/v1/user/' . $this->user->uuid);
        $response->assertStatus(404);
    }

    /**
     * Test update user profile permissions.
     *
     * @return void
     */
    public function testSaveProfilePermission()
    {
        $this->withoutExceptionHandling();
        // assign software engineer
        Bouncer::assign('software_engineer')->to($this->user);
        Passport::actingAs(
            $this->user
        );
        // try to switch to a non-assigned role
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'primary_role' => 'hp_manager',
        ];
        // update user with invalid primary role
        $response = $this->put('/v1/user/profile', $formData);
        // expect 422 error
        $response->assertStatus(422);
    }

    /**
     * Test update user profile.
     *
     * @return void
     */
    public function testSaveProfile()
    {
        $this->withoutExceptionHandling();
        // add the hp manager role
        Bouncer::sync($this->user)->roles(['hp_manager', 'software_engineer']);
        Passport::actingAs(
            $this->user
        );
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'primary_role' => 'hp_manager',
        ];
        // update user with valid primary role
        $response = $this->put('/v1/user/profile', $formData);
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'roles']);
        $this->assertEquals($formData['last_name'], $response->json('last_name'));
        // make sure the user type is changed to health plan when the user domain is changed
        $this->assertEquals('HealthPlanUser', $response->json('user_type'));
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->admin = User::factory()->create();
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        // assign superadmin role to user
        Bouncer::assign('software_engineer')->to($this->admin);
        // add user type engineering
        $this->user->engineeringUser()->save(EngineeringUser::factory()->create());
    }
}
