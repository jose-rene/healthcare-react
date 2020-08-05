<?php

namespace Tests\Feature;

// use App\Models\Phone;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Class ApiTest
 * @package Tests\Feature
 */
class ApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    private $user;

    /**
     * Make sure I login and make sure the correct user
     * is returned using the bearer token
     *
     * @return void
     */
    public function testApiLogin()
    {

        // Make sure I can login
        $response = $this->post('/api/login', [
            'email'    => $this->user->email,
            'password' => 'password',
        ]);

        $bearer_token = $response->json('access_token');

        $response
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_at', 'access_token']);

        // Make sure the bearer token is attached to the right user
        $response = $this->get('/api/user', [
            'Authorization' => "Bearer {$bearer_token}", // Utilize the bearer token
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email']);

        self::assertEquals($this->user->email, $response->json('email'));
    }

    /**
     * Make sure I can't login with a badpas sword and I get an expected response
     *
     * @return void
     */
    public function testBadApiLogin()
    {
        $response = $this->post('/api/login', [
            'email'    => $this->user->email,
            'password' => 'password1',
        ]);

        $response
            ->assertStatus(401)
            ->assertJsonStructure(['message'])
            ->assertJson(['message' => 'Unauthorized']);
    }

    /**
     * Before running these tests install passport to make sure the tokens exists
     */
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');

        // this will store a new user with random attributes in the database.
        /** @var User $user */
        $this->user = factory(User::class)->create();

        // this is an example of how to make multiple
        /*factory(User::class, 1000000)->make()->each(function ($user) {

            $user->phone->create(factory(Phone::class)->make()->toArray());

            $user->save();
        });*/
    }
}
