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
        $formData['can_view_reports'] = '1';
        $formData['can_view_invoices'] = false;
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        // dd($response->getContent());
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'primary_role', 'roles', 'abilities', 'payer']);

        // the user has the view reports ability
        $response->assertJsonPath('abilities', ['view-reports']);
        $this->assertEquals($formData['primary_role'], $response->json('primary_role'));
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
            'password'   => str_pad(preg_replace('~[^a-zA-Z0-9!_:\~#@\^\*\.\,\(\)\{\}\[\]\+\-\$]~', '', $this->faker->password), 8, '!'),
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
        $this->manager->save();
    }
}
