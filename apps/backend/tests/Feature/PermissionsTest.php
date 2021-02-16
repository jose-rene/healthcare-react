<?php

namespace Tests\Feature;

use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class PermissionsTest extends TestCase
{
    use RefreshDatabase;

    private $user = null;
    private $bearer_token = null;

    /**
     * Test access by role.
     *
     * @return void
     */
    public function testAccess()
    {
        Passport::actingAs(
            $admin = User::factory()->create()
        );
        // assign superadmin role
        Bouncer::assign('software_engineer')->to($admin);

        $response = $this->get('v1/user/' . $this->user->uuid);

        $response
            ->assertOk()
            ->assertJsonStructure(['email']);

        $this->assertEquals($this->user->email, $response->json('email'));
    }

    /**
     * Test access by role denied.
     *
     * @return void
     */
    public function testAccessDenied()
    {
        Passport::actingAs(
            User::factory()->create()
        );
        // user has no role / permissions should be forbidden
        $response = $this->get('v1/user/' . $this->user->uuid);

        $response->assertForbidden();
    }

    /**
     * Test access by ability.
     *
     * @return void
     */
    public function testAccessByAblity()
    {
        $this->withoutExceptionHandling();
        $admin = User::factory()->create();

        // grant the ability to create users
        Bouncer::allow($admin)->to('create-users');
        Passport::actingAs(
            $admin
        );

        // try adding a user
        $userData = $this->getUserToAdd();
        $response = $this->post('v1/user', $userData);

        $response
            ->assertStatus(201)
            ->assertJsonStructure(['email', 'first_name', 'last_name']);

        $this->assertEquals($userData['email'], $response->json('email'));
    }

    /**
     * Test deny access by ability.
     *
     * @return void
     */
    public function testDenyAccessByAblity()
    {
        Passport::actingAs(
            $admin = User::factory()->create()
        );
        // try adding a user
        $userData = $this->getUserToAdd();
        $response = $this->post('v1/user', $userData);
        $response->assertForbidden();
    }

    /**
     * Test role domain.
     *
     * @return void
     */
    public function testRoleDomain()
    {
        $role = Bouncer::role()->firstWhere(['name' => 'software_engineer']);
        $this->assertEquals('Engineering', $role->domain);
        $role = Bouncer::role()->firstWhere(['name' => 'hp_manager']);
        $this->assertEquals('HP Manager', $role->title);
        $this->assertEquals('Health Plan', $role->domain);
        $hpRoles = Bouncer::role()->getByDomain('Health Plan');
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $hpRoles);
        $this->assertEquals(4, $hpRoles->count());
    }

    protected function getUserToAdd()
    {
        $userToAdd = User::factory()->make();

        return [
            'first_name' => $userToAdd->first_name,
            'last_name'  => $userToAdd->last_name,
            'email'      => $userToAdd->email,
            'password'   => 'ABC123xyz',
        ];
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');

        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);

        $this->user = User::factory()->create();
    }
}
