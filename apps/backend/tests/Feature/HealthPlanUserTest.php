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

class HealthPlanUserTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $manager;

    /**
     * Test create health plan user.
     *
     * @return void
     */
    public function testHealthPlanUserCreate()
    {
        Passport::actingAs(
            $this->manager
        );
        $formData = $this->getFormData();
        $formData['primary_role'] = 'hp_user';
        $formData['job_title'] = 'Nurse';
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        // dd($response->getContent());
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'primary_role', 'roles', 'payer']);

        // the added users company should be the same as hp manager creating the user
        $response->assertJsonPath('payer.company_name', $this->manager->payer()->name);
        $this->assertEquals($formData['primary_role'], $response->json('primary_role'));
    }

    /**
     * Test create health plan user with ablity.
     *
     * @return void
     */
    public function testHealthPlanUserAbility()
    {
        $this->withoutExceptionHandling();
        Passport::actingAs(
            $this->manager
        );
        $formData = $this->getFormData();
        $formData['primary_role'] = 'hp_user';
        $formData['job_title'] = 'Nurse';
        $formData['can_view_reports'] = true;
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        // dd($response->getContent());
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'primary_role', 'roles', 'abilities', 'payer']);

        // the user has the view reports ability
        $response->assertJsonPath('abilities', ['view-reports']);
        // verify user currently can view reports
        $user = User::firstWhere('uuid', $response->json('id'));
        $this->assertTrue($user->can('view-reports'));
        $this->assertEquals($formData['primary_role'], $response->json('primary_role'));
    }

    /**
     * Test update health plan user.
     *
     * @return void
     */
    public function testHealthPlanUpdate()
    {
        Passport::actingAs(
            $this->manager
        );
        $formData = [
            'first_name'        => $this->faker->firstName,
            'last_name'         => $this->faker->lastName,
            'phone'             => $this->faker->phoneNumber,
            'primary_role'      => 'hp_finance',
            'can_view_reports'  => true,
            'can_view_invoices' => true,
            'can_create_users'  => true,
        ];

        // update user with data
        $response = $this->put('/v1/user/' . $this->user->uuid, $formData);
        //  dd($response->json());
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'roles', 'abilities']);

        $this->assertEquals($formData['last_name'], $response->json('last_name'));
        $this->assertEquals($formData['phone'], $response->json('phone_primary'));
        $this->assertEquals($formData['primary_role'], $response->json('primary_role'));
        $this->assertContains('view-reports', $response->json('abilities'));
        $this->assertContains('view-invoices', $response->json('abilities'));
        $this->assertContains('create-users', $response->json('abilities'));
        $this->assertTrue($this->user->can('view-invoices'));
        $this->assertTrue($this->user->can('view-reports'));
        $this->assertTrue($this->user->can('create-users'));
    }

    /**
     * Test remove abilities.
     *
     * @return void
     */
    public function testRemoveAbilites()
    {
        Passport::actingAs(
            $this->manager
        );

        // give the user abilites
        $this->user->allow('view-reports');
        $this->user->allow('view-invoices');
        $this->assertTrue($this->user->can('view-invoices'));
        $this->assertTrue($this->user->can('view-reports'));

        // update without abilities, ommiting is the same as false, test both
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'phone'        => $this->faker->phoneNumber,
            'primary_role' => 'hp_finance',
            'view-reports' => false,
        ];

        // update user with data
        $response = $this->put('/v1/user/' . $this->user->uuid, $formData);

        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'roles', 'abilities']);

        $this->assertEmpty($response->json('abilities'));
        $this->assertFalse($this->user->can('view-invoices'));
        $this->assertFalse($this->user->can('view-reports'));
    }

    /**
     * Test role escalation denial.
     *
     * @return void
     */
    public function testHealthPlanRoleEscalation()
    {
        Passport::actingAs(
            $this->manager
        );
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'phone'        => $this->faker->phoneNumber,
            'primary_role' => 'software_engineer',
        ];

        // update user with data
        $response = $this->put('/v1/user/' . $this->user->uuid, $formData);
        // verify role escalition is denied
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['primary_role']]);
    }

    /**
     * Get test form data.
     *
     * @return array
     */
    protected function getFormData()
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name'  => $this->faker->lastName,
            'email'      => $this->faker->unique()->safeEmail,
            'password'   => str_pad(preg_replace(config('rules.patterns.password_negate'), '', $this->faker->password), 8, '!'),
            'phone'      => $this->faker->phoneNumber,
        ];
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
        $this->manager->primary_role = 'hp_manager';
        $this->manager->save();
        $this->user = User::factory()->create();
        $this->user->user_type = 2;
        $this->user->primary_role = 'hp_user';
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());
        $this->user->phones()->create(['number' => $this->faker->phoneNumber, 'is_primary' => 1, 'phoneable_type' => User::class, 'phoneable_id' => $this->user->id]);
        Bouncer::sync($this->user)->roles(['hp_user']);
        $this->user->save();
    }
}
