<?php

namespace Tests\Feature;

use App\Jobs\PasswordExpireCheckJob;
use App\Models\Image;
use App\Models\User;
use App\Models\UserType\EngineeringUser;
use Artisan;
use Bouncer;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Laravel\Passport\Passport;
use Storage;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $user;
    protected User $admin;

    /**
     * Test profile route.
     *
     * @group functional
     * @return void
     */
    public function testProfile()
    {
        Passport::actingAs(
            $this->user
        );
        // fetch the user profile
        $response = $this->get('/v1/user/profile');

        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'roles', 'abilities']);

        $this->assertEquals($this->user->email, $response->json('email'));
    }

    /**
     * Test retrieve user.
     *
     * @return void
     */
    public function testRetrieve()
    {
        Passport::actingAs(
            $this->admin
        );
        // fetch the user profile
        $response = $this->get('/v1/user/' . $this->user->uuid);
        // will have the field gitlab_name for an engineering user
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'gitlab_name', 'roles', 'abilities', 'two_factor_options']);

        $this->assertEquals($this->user->email, $response->json('email'));
    }

    /**
     * Test time based password reset of user without password history.
     *
     * @return void
     */
    public function testRequirePasswordUserNoHistory()
    {
        // create a condition where the user will be required to change their password
        $this->admin->reset_password = false;
        $this->admin->created_at = Carbon::now()->subYears(2); // 2 years since they registered
        $this->admin->save();

        // as old as the created user is this should set the reset_password to true
        dispatch((new PasswordExpireCheckJob($this->admin)));

        Passport::actingAs(
            $this->admin
        );
        // fetch the user profile
        $response = $this->get('/v1/user/profile/');
        // will have the field gitlab_name for an engineering user
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'roles', 'reset_password']);

        self::assertEquals(true, $response->json('reset_password'));
    }

    /**
     * Test time based password reset of user with password history.
     *
     * @return void
     */
    public function testRequirePasswordResetUserWithHistory()
    {
        // create a condition where the user will be required to change their password
        $this->admin->reset_password = false; // 2 years since they registered
        $this->admin->save();
        $this->admin->password_history()->create(
            [
                'password' => bcrypt('password'),
            ]
        );

        $ph = $this->admin->password_history->first();
        $ph->created_at = Carbon::now()->subYears(2);
        $ph->save();

        // as old as the created user is this should set the reset_password to true
        dispatch((new PasswordExpireCheckJob($this->admin)));

        Passport::actingAs(
            $this->admin
        );
        // fetch the user profile
        $response = $this->get('/v1/user/profile/');
        // will have the field gitlab_name for an engineering user
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'roles', 'reset_password']);

        self::assertEquals(true, $response->json('reset_password'));
    }

    /**
     * Test create user.
     *
     * @return void
     */
    public function testCreate()
    {
        Passport::actingAs(
            $this->admin
        );
        $formData = $this->getFormData();
        $formData['primary_role'] = 'software_engineer';
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'primary_role', 'roles']);

        $this->assertEquals($formData['email'], $response->json('email'));
        $this->assertEquals($formData['primary_role'], $response->json('primary_role'));
        $this->assertEquals($formData['phone'], $response->json('phones.0.number'));
    }

    /**
     * Test create user error.
     *
     * @return void
     */
    public function testCreateFail()
    {
        Passport::actingAs(
            $this->admin
        );
        // leave out password
        $badData = $this->getFormData();
        unset($badData['email']);
        // create the user with data
        $response = $this->post('/v1/user', $badData);
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['email']]);
    }

    /**
     * Test create fail role permissions.
     *
     * @return void
     */
    public function testCreateFailRole()
    {
        // add the hp manager
        $hpManager = User::factory()->create();
        Bouncer::sync($hpManager)->roles(['hp_manager']);
        // @todo this should be done in factory, maybe a healthplan user factoryshow
        $hpManager->user_type = 2;
        $hpManager->syncUserType();
        $hpManager->save();
        Passport::actingAs(
            $hpManager
        );
        $formData = $this->getFormData();
        // apply a role not available in health plan domain
        $formData['primary_role'] = 'software_engineer';
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        $response->assertStatus(422);
    }

    /**
     * Test create fail role policy.
     *
     * @return void
     */
    public function testCreateFailPolicy()
    {
        // sync a role that cannot create users
        Bouncer::sync($this->admin)->roles(['hp_user']);
        Passport::actingAs(
            $this->admin
        );
        $formData = $this->getFormData();
        $formData['primary_role'] = 'hp_user';
        // create the user with data
        $response = $this->post('/v1/user', $formData);
        // expect to be denied by policy
        $response->assertStatus(403);
    }

    /**
     * Test update user.
     *
     * @group functional
     * @return void
     */
    public function testUpdate()
    {
        Passport::actingAs(
            $this->admin
        );
        $formData = [
            'first_name'        => $this->faker->firstName,
            'last_name'         => $this->faker->lastName,
            'phone'             => $this->faker->phoneNumber,
            'two_factor_method' => 'app',
        ];
        // update user with data
        $response = $this->put('/v1/user/' . $this->user->uuid, $formData);
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'phones', 'roles']);

        $this->assertEquals($formData['last_name'], $response->json('last_name'));
        $this->assertEquals($formData['phone'], $response->json('phones.0.number'));
    }

    /**
     * Test update user fail.
     *
     * @return void
     */
    public function testUpdateFail()
    {
        Passport::actingAs(
            $this->admin
        );
        $formData = [
            'first_name' => $this->faker->firstName,
        ];
        // update user with data
        $response = $this->put('/v1/user/' . $this->user->uuid, $formData);
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['last_name']]);
    }

    /**
     * Test update user fail role.
     *
     * @return void
     */
    public function testUpdateFailRole()
    {
        Passport::actingAs(
            $this->admin
        );
        // try to set primary role to one the user does not have
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'primary_role' => 'hp_user',
        ];
        // update user with data
        $response = $this->put('/v1/user/profile', $formData);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message']);
    }

    /**
     * Test update fail role policy.
     *
     * @return void
     */
    public function testUpdateFailPolicy()
    {
        // sync a role that cannot update users
        Bouncer::sync($this->admin)->roles(['hp_user']);
        Passport::actingAs(
            $this->admin
        );
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'primary_role' => 'hp_user',
        ];
        // update user with data
        $response = $this->put('/v1/user/' . $this->user->uuid, $formData);
        // expect to be denied by policy
        $response->assertStatus(403);
    }

    /**
     * Test retrieve user.
     *
     * @return void
     */
    public function testDelete()
    {
        Passport::actingAs(
            $this->admin
        );
        // fetch the user profile
        $response = $this->delete('/v1/user/' . $this->user->uuid);
        $response
            ->assertOk()
            ->assertJsonStructure(['message'])
            ->assertSee($this->user->email);

        // verify user has been deleted
        $response = $this->get('/v1/user/' . $this->user->uuid);
        $response->assertStatus(404);
    }

    /**
     * Test update user profile permissions.
     *
     * @return void
     */
    public function testSaveProfilePermission()
    {
        // assign software engineer
        Bouncer::assign('software_engineer')->to($this->user);
        Passport::actingAs(
            $this->user
        );
        // try to switch to a non-assigned role
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'primary_role' => 'hp_manager',
        ];
        // update user with invalid primary role
        $response = $this->put('/v1/user/profile', $formData);
        // expect 422 error
        $response->assertStatus(422);
    }

    /**
     * Test update user profile.
     *
     * @return void
     */
    public function testSaveProfile()
    {
        // add the hp manager role
        Bouncer::sync($this->user)->roles(['hp_manager', 'software_engineer']);
        Passport::actingAs(
            $this->user
        );
        $formData = [
            'first_name'   => $this->faker->firstName,
            'last_name'    => $this->faker->lastName,
            'primary_role' => 'hp_manager',
        ];
        // update user with valid primary role
        $response = $this->put('/v1/user/profile', $formData);
        $response
            ->assertOk()
            ->assertJsonStructure(['first_name', 'last_name', 'email', 'roles']);
        $this->assertEquals($formData['last_name'], $response->json('last_name'));
        // make sure the user type is changed to health plan when the user domain is changed
        $this->assertEquals('HealthPlanUser', $response->json('user_type'));
    }

    /**
     * @group file-upload
     */
    public function testUploadingAProfileImage()
    {
        $imageDiskName = config('filesystems.defaultImageImage', 'image');
        Passport::actingAs(
            $this->user
        );

        $this->withoutExceptionHandling();
        Storage::fake($imageDiskName);
        $profileImage = UploadedFile::fake()->create('someProfileImage.png', 1001, 'image/png');

        // Make sure I can upload the file
        $response = $this->post(route('api.user.profile.image.save'), [
            'name'      => 'someProfileImage.png',
            'mime_type' => 'image/png',
            'file'      => $profileImage,
        ]);
        $response->assertSuccessful();
        $imageFromResponse = $response->json();

        // make sure the image is tracked in the database and exists in the filesystem
        self::assertCount(1, Image::all());
        Storage::disk($imageDiskName)->assertExists($imageFromResponse['id']);

        // request the file using the user profile image url
        $test = $this->get(route('profile.image.show', [
            'user'      => $this->user,
            'user_name' => 'test user',
        ]));
        $test->assertOk();
    }

    /**
     * Test available roles route.
     *
     * @return void
     */
    public function testAvailableRoles()
    {
        $user = User::factory()->create();
        Bouncer::assign('software_engineer')->to($user);
        $user->primary_role = 'software_engineer';
        $user->save();
        Passport::actingAs(
            $user
        );
        // fetch the user available roles
        $response = $this->get('/v1/user/available_roles');
        $response->assertOk();
    }

    /**
     * Test available roles domain limited.
     *
     * @return void
     */
    public function testAvailableRolesLimit()
    {
        $user = User::factory()->create();
        Bouncer::assign('software_engineer')->to($user);
        $user->primary_role = 'software_engineer';
        $user->save();
        $user->forbid('apply-any-role');
        Passport::actingAs(
            $user
        );
        // fetch the available roles
        $response = $this->get('/v1/user/available_roles');
        $response->assertOk();
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
        $this->user = User::factory()->create();
        $this->admin = User::factory()->create();
        $this->user->phones()->create(['number' => $this->faker->phoneNumber, 'is_primary' => 1, 'phoneable_type' => User::class, 'phoneable_id' => $this->user->id]);
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        // assign superadmin role to user
        Bouncer::assign('software_engineer')->to($this->admin);
        // add user type engineering
        $this->user->engineeringUser()->save(EngineeringUser::factory()->create());
    }
}
