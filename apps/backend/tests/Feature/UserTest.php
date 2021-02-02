<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $user;

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
            User::factory()->create()
        );
        // fetch the user profile
        $response = $this->get('/v1/user/' . $this->user->uuid);

        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'roles']);

        // dd($response->getContent());

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
            $this->user
        );
        $formData = [
            'first_name' => $this->faker->firstName,
            'last_name'  => $this->faker->lastName,
            'email'      => $this->faker->unique()->safeEmail,
            'password'   => preg_replace('~[^a-zA-Z0-9!_:\~#@\^\*\.\,\(\)\{\}\[\]\+\-\$]~', '!', $this->faker->password),
            'phone'      => $this->faker->phoneNumber,
        ];
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        // dd($response->json());
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
            $this->user
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
     * Test create user.
     *
     * @return void
     */
    public function testUpdate()
    {
        Passport::actingAs(
            User::factory()->create()
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
            User::factory()->create()
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

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }
}
