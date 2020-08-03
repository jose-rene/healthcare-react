<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Auth\AuthenticationException;
use App\Models\User;

class AuthenticationTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * Test authenticating against user provider.
     *
     * @return void
     */
    public function testAuthentication()
    {
        // seed the test User
        \Artisan::call('db:seed', [
            '--class' => 'TestUserSeeder',
        ]);
        $user = User::find(1)->first();
        // set up passport db tables and get the DME-Api Password Grant Client
        \Artisan::call('passport:install');
        // login
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->post('api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        // validate response
        $response->assertStatus(200);
        // validate response structure
        $response->assertJsonStructure([
            'access_token',
            'token_type',
            'expires_at',
        ]);
        $data = json_decode($response->getContent(), true);
        // test accessing a protected endpoint with bearer token
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
            'Authorization' =>  'Bearer ' . $data['access_token'],
        ])->get('/api/user');
        $response->assertStatus(200);
        $response->assertSee($user->email);
    }

    /**
     * Test protected endpoint.
     *
     * @return void
     */
    public function testEndpoint()
    {
        $this->withoutExceptionHandling();
        $this->expectException(AuthenticationException::class);
        $response = $this->withHeaders($headers = [
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', $endpoint = 'api/user');
        Passport::actingAs(
            $user = factory(User::class)->create()
        );
        $response = $this->withHeaders($headers = [
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', $endpoint);
        $response->assertStatus(200);
        $response->assertSee($user->email);
    }
}
