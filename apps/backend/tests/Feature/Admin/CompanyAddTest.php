<?php

namespace Tests\Feature\Admin;

use App\Models\Payer;
use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class CompanyAddTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $member;

    /**
     * Test updating payer.
     *
     * @return void
     */
    public function testCompanyAdd()
    {
        // make a company
        $data = [
            'name'           => $company = $this->faker->company(),
            'category'       => 1, // payer
            'payer_category' => 1,
        ];
        $response = $this->json('POST', route('api.admin.company.create'), $data);
        // validate response code and structure
        $response
            ->assertStatus(201)
            ->assertJsonPath('company_name', $company);

        // make a therapy network
        $data = [
            'name'     => $company = $this->faker->company(),
            'category' => 3, // therapy network
        ];
        $response = $this->json('POST', route('api.admin.company.create'), $data);
        // validate response code and structure
        $response
            ->assertStatus(201)
            ->assertJsonPath('company_name', $company);

        // test permissions, remove ablity
        Bouncer::disallow('client_services_specialist')->to('create-payers');
        Bouncer::refresh();
        $response = $this->json('POST', route('api.admin.company.create'), $data);
        // validate forbidden response code
        $response->assertStatus(403);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        $this->payer = Payer::factory()->hasLobs(5, ['is_tat_enabled' => 1])->count(1)->create()->first();
        $this->admin = User::factory()->create(['user_type' => 4, 'primary_role' => 'client_services_specialist']);
        Bouncer::sync($this->admin)->roles(['client_services_specialist']);
        $this->admin->save();
        Passport::actingAs(
            $this->admin
        );
    }
}
