<?php

namespace Tests\Feature\Admin;

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
    public function testClinicalUserSearch()
    {
        // get clinical users
        $response = $this->json('GET', route('api.admin.clinicaluser.search'), ['status_id' => 1]);
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

    /**
     * Test clinical user params.
     *
     * @return void
     */
    public function testClinicalUserParams()
    {
        // get clinical user status and type options
        $response = $this->json('GET', route('api.admin.clinicaluser.params'));
        // validate response code and structure
        $response
            ->assertOk()
            ->assertJsonStructure(['user_statuses', 'user_types', 'types', 'therapy_networks', 'roles']);
    }

    /**
     * Test clinical user create.
     * 
     * @group user-crud
     *
     * @return void
     */
    public function testClinicalUserCreate()
    {
        // create a user with form data
        $response = $this->json('POST', route('api.admin.clinicaluser.store'), $formData = $this->getFormData());

        // validate response code and structure
        $response
            ->assertStatus(201)
            ->assertJsonPath('first_name', $formData['first_name'])
            ->assertJsonPath('last_name', $formData['last_name'])
            ->assertJsonPath('email', $formData['email'])
            ->assertJsonPath('phone_primary', $formData['phone'])
            ->assertJsonPath('clinical_user_type.id', $formData['clinical_user_type_id']);

        // verify user has been created
        $createdUser = User::firstWhere('uuid', $response->json()['id']);
        $this->assertInstanceOf(User::class, $createdUser);
    }

    /**
     * Test clinical user update.
     *
     * @depends testClinicalUserCreate
     * @group user-crud
     * 
     * @return void
     */
    public function testClinicalUserUpdate()
    {
        $response = $this->json('POST', route('api.admin.clinicaluser.store'), $this->getFormData());
        $userId = $response->json()['id'];
        // update user with form data
        $response = $this->json('PUT', route('api.admin.clinicaluser.update', $userId), $formData = $this->getFormData());

        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonPath('first_name', $formData['first_name'])
            ->assertJsonPath('last_name', $formData['last_name'])
            ->assertJsonPath('email', $formData['email'])
            ->assertJsonPath('phone_primary', $formData['phone'])
            ->assertJsonPath('clinical_user_type.id', $formData['clinical_user_type_id']);
    }

    /**
     * Test clinical user show.
     *
     * @depends testClinicalUserCreate
     * @group user-crud
     * 
     * @return void
     */
    public function testClinicalUserShow()
    {
        // $this->withoutExceptionHandling();
        $response = $this->json('POST', route('api.admin.clinicaluser.store'), $formData = $this->getFormData());
        $userId = $response->json()['id'];
        // fetch the user with userId
        $response = $this->json('GET', route('api.admin.clinicaluser.show', $userId));

        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonPath('first_name', $formData['first_name'])
            ->assertJsonPath('last_name', $formData['last_name'])
            ->assertJsonPath('email', $formData['email'])
            ->assertJsonPath('phone_primary', $formData['phone'])
            ->assertJsonPath('clinical_user_type.id', $formData['clinical_user_type_id']);
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
            'clinical_type_id'        => ClinicalType::first()->id,
            'clinical_user_status_id' => ClinicalUserStatus::first()->id,
            'clinical_user_type_id'   => ClinicalUserType::first()->id,
            'first_name'              => $this->faker->firstName,
            'last_name'               => $this->faker->lastName,
            'email'                   => $this->faker->unique()->safeEmail,
            'phone'                   => $this->faker->phoneNumber,
            'primary_role'            => 'field_clinician',
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
        // seed some therapist clinicians
        $users = ClinicalServicesUser::factory([
            'user_id' => fn () => User::factory()->create(['user_type' => User::mapType('ClinicalServicesUser'), 'primary_role' => 'field_clinician']),
        ])->count(5)->create();
        $users->each(fn($item) => ($item->user->assign('field_clinician')));
        $this->payer = Payer::factory()->hasLobs(5, ['is_tat_enabled' => 1])->count(1)->create()->first();
        $this->admin = User::factory()->create(['user_type' => 4, 'primary_role' => 'client_services_specialist']);
        Bouncer::sync($this->admin)->roles(['client_services_specialist']);
        $this->admin->save();
        Passport::actingAs(
            $this->admin
        );
    }
}
