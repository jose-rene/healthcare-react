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

class CompanyContactsTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $member;

    /**
     * Test updating payer.
     *
     * @return void
     */
    public function testCompanyAddContacts()
    {
        $this->withoutExceptionHandling();
        $phone = ['type' => 'Phone', 'value' => $number = $this->faker->phonenumber];
        $email = ['type' => 'Home Email', 'value' => $emailAddress = $this->faker->email];
        $formData = ['contacts' => [$phone, $email]];
        $response = $this->json('POST', route('api.admin.payer.contact.create', ['payer' => $this->payer]), $formData);
        $response
            ->assertOk()
            ->assertJsonPath('phone.number', $number)
            ->assertJsonPath('email.email', $emailAddress);
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
