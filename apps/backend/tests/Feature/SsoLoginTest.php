<?php

namespace Tests\Feature;

use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class SsoLoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    protected $user;

    /**
     * @var Url
     */
    protected $url;

    /**
     * Test the sso login request route.
     *
     * @return void
     */
    public function testLoginRequest()
    {
        $response = $this->get($this->url);
        $response->assertStatus(200)->assertJsonStructure(['token_type', 'expires_at', 'access_token']);
        // test the creditials
        $token = $response->json('access_token');
        $response = $this->get('/v1/user/profile', [
            'Authorization' => sprintf('Bearer %s', $token),
        ]);
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email']);

        $this->assertEquals($this->user->email, $response->json('email'));
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // generate a user for tests
        $this->user = User::factory()->create();
        // generate a signed url for this user
        $this->url = URL::temporarySignedRoute('api.ssologin', now()->addMinutes(env('SSO_URL_TIMEOUT', 5)), ['email' => $this->user->email]);
    }
}
