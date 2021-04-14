<?php

namespace Tests\Feature;

// use App\Models\Phone;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Class ApiTest.
 */
class LoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    private $user;

    /**
     * Make sure I login and make sure the correct user
     * is returned using the bearer token.
     *
     * @return void
     */
    public function testApiLogin()
    {
        // Make sure I can login
        $response = $this->postJson(
            '/v1/login',
            [
                'email'    => $this->user->email,
                'password' => 'password',
            ]
        );

        $this->user->assign('admin');

        $bearer_token = $response->json('access_token');

        $response
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_at', 'access_token']);

        // Make sure the bearer token is attached to the right user
        $response = $this->get(
            '/v1/user/profile',
            [
                'Authorization' => "Bearer {$bearer_token}", // Utilize the bearer token
            ]
        );

        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email']);

        $this->assertEquals($this->user->email, $response->json('email'));

        // even thou the primary_role value is not set explicitly make sure
        // its pulled from the assigned role.
        $this->assertEquals('admin', $response->json('primary_role'));

        // test attribute full name
        $this->assertEquals(
            sprintf('%s %s', $this->user->first_name, $this->user->last_name),
            $response->json('full_name')
        );
    }

    /**
     * Make sure I can't login with a bad password and I get an expected response.
     *
     * @return void
     */
    public function testBadApiLogin()
    {
        $response = $this->post('/v1/login', [
            'email'    => $this->user->email,
            'password' => 'password1',
        ]);

        $response
            ->assertStatus(401)
            ->assertJsonStructure(['message'])
            ->assertJson(['message' => 'Unauthorized']);
    }

    /**
     * Make sure email is validated before authentication.
     *
     * @return void
     */
    public function testEmailValidation()
    {
        $response = $this
            ->withHeaders([
                'Accept'           => 'application/json',
                'X-Requested-With' => 'XMLHttpRequest',
            ])
            ->post('/v1/login', [
                'email'    => 'somethingthatsnotanemail@',
                'password' => 'password',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message'])
            ->assertJson(['message' => 'The given data was invalid.'])
            ->assertSee('Your email must be a valid email address.');
    }

    /**
     * Make sure password is validated before authentication.
     *
     * @return void
     */
    public function testPasswordValidation()
    {
        // test too few characters
        $response = $this
            ->withHeaders([
                'Accept'           => 'application/json',
                'X-Requested-With' => 'XMLHttpRequest',
            ])
            ->post('/v1/login', [
                'email'    => $this->user->email,
                'password' => Str::random(5),
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message'])
            ->assertJson(['message' => 'The given data was invalid.'])
            ->assertSee('Your password must be at least 8 characters.');

        // too many characters
        $response = $this
            ->withHeaders([
                'Accept'           => 'application/json',
                'X-Requested-With' => 'XMLHttpRequest',
            ])
            ->post('/v1/login', [
                'email'    => $this->user->email,
                'password' => Str::random(80),
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message'])
            ->assertJson(['message' => 'The given data was invalid.'])
            ->assertSee('Your password may not be greater than 64 characters.');
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // this will store a new user with random attributes in the database.
        /* @var User $user */
        $this->user = User::factory(['password' => Hash::make('password')])->create();

        // this is an example of how to make multiple
        /*factory(User::class, 1000000)->make()->each(function ($user) {

            $user->phone->create(factory(Phone::class)->make()->toArray());

            $user->save();
        });*/
    }
}
