<?php

namespace Tests\Feature;

use App\Models\Payer;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class PayerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $member;
    protected $user;

    /**
     * Test fetching plans.
     *
     * @return void
     */
    public function testGetPayer()
    {
        Passport::actingAs(
            $this->user
        );
        // get the lines of business
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/payer/' . $this->payer->uuid);
        // validate response code
        // dd($response->json());
        $response->assertStatus(200);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        $this->payer = Payer::factory()->hasLobs(5)->count(1)->create()->first();
        $this->payer->lobs()->updateExistingPivot($this->payer->lobs()->first(), ['is_tat_enabled' => 1]);
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());
        Bouncer::sync($this->user)->roles(['hp_user']);
        $this->user->save();
    }
}
