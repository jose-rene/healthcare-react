<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\TwoFactorNotification;
use Artisan;
use Google2FA;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Class ApiTest.
 */
class LoginTest extends TestCase
{
    use RefreshDatabase, WithFaker;

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
                ],
                [
                    'User-Agent' => $this->faker->userAgent(),
                ]
            );
        // validate response
        $response
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_at', 'access_token']);
        // validate login history
        $this->assertEquals($this->user->loginHistory->count(), 1);

        $this->user->assign('admin');
        $bearer_token = $response->json('access_token');
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
     * Test one time password authentication.
     *
     * @return void
     */
    public function testOtpLogin()
    {
        // set 2fa to true
        $this->user->update(['is_2fa' => true]);
        // login
        $response = $this->postJson(
            '/v1/login',
            [
                'email'    => $this->user->email,
                'password' => 'password',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonStructure(['qr_image', 'otp_url', 'otp_token']);

        // refresh the user, the secret key was set on the previous request
        $this->user->refresh();
        // $this->user->assign('admin');
        $data = $response->json();
        $path = parse_url($data['otp_url'], \PHP_URL_PATH);
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => Google2FA::getCurrentOtp($this->user->google2fa_secret),
                'token' => $data['otp_token'],
            ]
        );
        // assert 2fa was successful and a bearer token is returned
        $response
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_at', 'access_token']);
    }

    /**
     * Test invalid one time password authentication.
     *
     * @return void
     */
    public function testBadOtpLogin()
    {
        // set 2fa to true
        $this->user->update(['is_2fa' => true]);
        // login
        $response = $this->postJson(
            '/v1/login',
            [
                'email'    => $this->user->email,
                'password' => 'password',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonStructure(['qr_image', 'otp_url', 'otp_token']);

        // refresh the user, the secret key was set on the previous request
        $this->user->refresh();
        // $this->user->assign('admin');
        $data = $response->json();
        $path = parse_url($data['otp_url'], \PHP_URL_PATH);
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => '1234567',
                'token' => $data['otp_token'],
            ]
        );
        // assert opt fail and a retry token is returned
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message', 'retry_token']);

        // test the retry token
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => Google2FA::getCurrentOtp($this->user->google2fa_secret),
                'token' => $response->json('retry_token'),
            ]
        );
        // assert 2fa was successful and a bearer token is returned
        $response
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_at', 'access_token']);
    }

    /**
     * Test invalid one time password token.
     *
     * @return void
     */
    public function testBadOtpToken()
    {
        // set 2fa to true
        $this->user->update(['is_2fa' => true]);
        // login
        $response = $this->postJson(
            '/v1/login',
            [
                'email'    => $this->user->email,
                'password' => 'password',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonStructure(['qr_image', 'otp_url', 'otp_token']);

        // refresh the user, the secret key was set on the previous request
        $this->user->refresh();
        // $this->user->assign('admin');
        $data = $response->json();
        $path = parse_url($data['otp_url'], \PHP_URL_PATH);
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => '1234567',
                'token' => $data['otp_token'],
            ]
        );
        // assert otp fail and a retry token is returned
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message', 'retry_token']);

        // use previous one time token instead of the retry token, should give token error
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => Google2FA::getCurrentOtp($this->user->google2fa_secret),
                'token' => $data['otp_token'],
            ]
        );
        // assert 2fa failed with token mismatch
        $response
            ->assertStatus(401)
            ->assertJsonStructure(['message'])
            ->assertJsonPath('message', 'OTP Token Mismatch.');
    }

    /**
     * Test one time password authentication via notification.
     *
     * @return void
     */
    public function testOtpNotification()
    {
        // set 2fa to true, method to email
        $this->user->update(['is_2fa' => true, 'twofactor_method' => 'email']);
        // a notification will be generated on with otp
        Notification::fake();
        // login
        $response = $this->postJson(
            '/v1/login',
            [
                'email'    => $this->user->email,
                'password' => 'password',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonStructure(['otp_url', 'otp_token']);

        $code = '';
        // verify notification sent and get the code
        Notification::assertSentTo(
            $this->user,
            function (TwoFactorNotification $notification, $channels) use (&$code) {
                $code = $notification->getCode();

                return strlen($code) === 6;
            }
        );

        // login with the otp token and code returned in notification
        $data = $response->json();
        $path = parse_url($data['otp_url'], \PHP_URL_PATH);
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => $code,
                'token' => $data['otp_token'],
            ]
        );
        // assert 2fa was successful and a bearer token is returned
        $response
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_at', 'access_token']);
    }

    /**
     * Test one time password authentication via notification.
     *
     * @return void
     */
    public function testOtpNotificationSms()
    {
        // set 2fa to true, method to email
        $this->user->update(['is_2fa' => true, 'twofactor_method' => 'sms']);
        // a notification will be generated on with otp
        Notification::fake();
        // login
        $response = $this->postJson(
            '/v1/login',
            [
                'email'    => $this->user->email,
                'password' => 'password',
            ]
        );
        $response
            ->assertOk()
            ->assertJsonStructure(['otp_url', 'otp_token']);

        $code = '';
        // verify notification sent and get the code
        Notification::assertSentTo(
            $this->user,
            function (TwoFactorNotification $notification, $channels) use (&$code) {
                $code = $notification->getCode();

                return strlen($code) === 6;
            }
        );

        // login with the otp token and code returned in notification
        $data = $response->json();
        $path = parse_url($data['otp_url'], \PHP_URL_PATH);
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => $code,
                'token' => $data['otp_token'],
            ]
        );
        // assert 2fa was successful and a bearer token is returned
        $response
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_at', 'access_token']);
    }

    /**
     * Test bad code authentication via notification.
     *
     * @return void
     */
    public function testBadOtpNotification()
    {
        // set 2fa to true, method to email
        $this->user->update(['is_2fa' => true, 'twofactor_method' => 'email']);
        // a notification will be generated on with otp
        Notification::fake();
        // login
        $response = $this->postJson(
            '/v1/login',
            [
                'email'    => $this->user->email,
                'password' => 'password',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonStructure(['otp_url', 'otp_token']);

        $code = '';
        // verify notification sent and get the code
        Notification::assertSentTo(
            $this->user,
            function (TwoFactorNotification $notification, $channels) use (&$code) {
                $code = $notification->getCode();

                return strlen($code) === 6;
            }
        );

        // make an invalid code
        $code = '111111' === $code ? '111112' : '111111';
        // login with the otp token and bad code
        $data = $response->json();
        $path = parse_url($data['otp_url'], \PHP_URL_PATH);
        $response = $this->postJson(
            $path,
            [
                'email' => $this->user->email,
                'code'  => $code,
                'token' => $data['otp_token'],
            ]
        );
        // assert error response
        $response->assertStatus(401)
            ->assertJsonStructure(['message'])
            ->assertJsonPath('message', 'OTP Token or Code Mismatch.');
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
    }
}
