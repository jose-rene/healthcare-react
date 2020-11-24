<?php

namespace Tests\Feature;

use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionsTest extends TestCase
{
    use RefreshDatabase;

    private $user = null;
    private $bearer_token = null;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testSuperAdminAssigned()
    {
        $this->user->assign('admin');

        $response = $this->get('v1/something/for/super-admins', [
            'Authorization' => "Bearer {$this->bearer_token}", // Utilize the bearer token
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'full_name' => $this->user->first_name . ' ' . $this->user->last_name,
                'roles'     => [
                    ['name' => 'admin'],
                ],
            ]);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testSuperAdminNotAssigned()
    {
        $response = $this->get('v1/something/for/super-admins', [
            'Authorization' => "Bearer {$this->bearer_token}", // Utilize the bearer token
        ]);

        $response->assertForbidden();
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        Bouncer::allow('admin')->everything();

        $this->user = User::factory()->create();

        $response = $this->post('/v1/login', [
            'email'    => $this->user->email,
            'password' => 'password',
        ]);

        $this->bearer_token = $response->json('access_token');
    }
}
