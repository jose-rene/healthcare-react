<?php

namespace Tests\Feature\Admin;

use App\Models\Language;
use App\Models\MemberNumberType;
use App\Models\Payer;
use App\Models\Address;
use App\Models\TrainingDocument;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class.
 * @link  https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link  https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 * @group admin
 */
class UserTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $searchable;
    protected $user;

    /**
     * Test user search.
     *
     * @return void
     */
    public function testSearch()
    {
        // get the first user
        $search = $this->searchable->first();
        $params = [
            'perPage'   => 50,
            'user_type' => $search->user_type,
            'search' => $search->email,
        ];
        // search users
        $url = route('api.admin.users.index', $params);
        $response = $this->get($url);
        // should return the one and only user, the admin for this request
        $response
            ->assertOk()
            ->assertJsonStructure([
                'data',
            ])
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.email', $search->email);
    }

    /**
     * Test user search all.
     *
     * @return void
     */
    public function testSearchAll()
    {
        // get the first user
        $search = $this->searchable->first();
        // search all healthplan users
        $params = [
            'perPage'   => 50,
            'user_type' => 2,
        ];
        // search users
        $url = route('api.admin.users.index', $params);
        $response = $this->get($url);
        // should return the the five hp usrs
        $response
            ->assertOk()
            ->assertJsonStructure([
                'data',
            ])
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('data.0.email', $search->email);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        
        $this->user = User::factory()->create(['user_type' => 1, 'primary_role' => 'client_services_specialist']);
        // $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());

        // create some searchable users
        $this->searchable = User::factory()
            ->count(5)
            ->create(['user_type' => 2, 'primary_role' => 'hp_user']);

        Bouncer::allow('admin')->everything();

        Bouncer::sync($this->user)->roles(['client_services_specialist', 'admin']);
        $this->user->save();
        Passport::actingAs(
            $this->user
        );
    }
}
