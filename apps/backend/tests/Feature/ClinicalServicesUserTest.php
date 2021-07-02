<?php

namespace Tests\Feature;

use App\Models\ClinicalType;
use App\Models\ClinicalUserStatus;
use App\Models\ClinicalUserType;
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
     * Test clinical user search.
     *
     * @return void
     */
    public function testClinicalUserUpdate()
    {
        $this->withoutExceptionHandling();
        // get clinical user
        $response = $this->json('GET', route('api.user.profile'));
        // validate response code and structure
        $response
            ->assertOk();
        // update user with form data
        $response = $this->json('PUT', route('api.clinicaluser.update'), $formData = $this->getFormData());
        // validate response code and structure
        $response
            ->assertOk()
            ->assertJsonPath('first_name', $formData['first_name'])
            ->assertJsonPath('last_name', $formData['last_name'])
            ->assertJsonPath('phone_primary', $formData['phone'])
            ->assertJsonPath('notification_prefs', $formData['notification_prefs'])
            ->assertJsonPath('title', $formData['title']);
    }

    /**
     * Get test form data.
     *
     * @group functional
     * @return array
     */
    protected function getFormData()
    {
        return [
            'first_name'              => $this->faker->firstName,
            'last_name'               => $this->faker->lastName,
            'phone'                   => $this->faker->phoneNumber,
            'notification_prefs'      => ['mail'],
            'title'                   => $this->faker->jobTitle,
        ];
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
        // create a clinician user
        $this->user = User::factory()->create([
            'user_type' => 3,
            'primary_role' => 'field_clinician',
            'notification_prefs' => ['sms'],
        ]);
        // associate the clinical services user
        ClinicalServicesUser::factory()->create([
            'user_id' => $this->user
        ]);
        Bouncer::sync($this->user)->roles(['field_clinician']);
        $this->user->save();
        Passport::actingAs(
            $this->user
        );
    }
}
