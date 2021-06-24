<?php

namespace Tests\Feature\Admin;

use App\Models\Payer;
use App\Models\User;
use App\Models\UserType\ClinicalServicesUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ClinicalServicesUserTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $member;

    /**
     * Test updating payer.
     *
     * @return void
     */
    public function testClinicalUserSearch()
    {
        // get clinical users
        $response = $this->json('GET', route('api.admin.clinicaluser.search'), ['status_id' => 1]);
        // dd($response->json());
        // validate response code and structure
        $response
            ->assertOk()
            ->assertJsonCount(5, 'data');
        // no seeded users with status id 2, should return empty
        $response = $this->json('GET', route('api.admin.clinicaluser.search'), ['status_id' => 2]);
        // dd($response->json());
        // validate response code and structure
        $response
            ->assertOk()
            ->assertJsonCount(0, 'data');

        // test with type id
        $response = $this->json('GET', route('api.admin.clinicaluser.search'), [
            'status_id' => 1,
            'type_id'   => 1,
        ]);
        $response
            ->assertOk()
            ->assertJsonCount(5, 'data');
        // no seeded users with type id 2, should return empty
        $response = $this->json('GET', route('api.admin.clinicaluser.search'), [
            'status_id' => 1,
            'type_id'   => 2,
        ]);
        $response
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        Artisan::call('db:seed', [
            '--class' => 'ClinicalUserRelatedSeeder',
        ]);
        // seed some therapist clinicians
        ClinicalServicesUser::factory()->count(5)->create();
        $this->payer = Payer::factory()->hasLobs(5, ['is_tat_enabled' => 1])->count(1)->create()->first();
        $this->admin = User::factory()->create(['user_type' => 4, 'primary_role' => 'client_services_specialist']);
        Bouncer::sync($this->admin)->roles(['client_services_specialist']);
        $this->admin->save();
        Passport::actingAs(
            $this->admin
        );
    }
}
