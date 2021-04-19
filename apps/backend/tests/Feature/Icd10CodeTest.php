<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;
use Laravel\Passport\Passport;
use Tests\TestCase;

class Icd10CodeTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;

    /**
     * Test fetching member.
     *
     * @return void
     */
    public function testLookupCode()
    {
        $this->withoutExceptionHandling();
        // lookup code
        $route = route('api.icd10code.lookup');
        // mock returned api data
        Http::fake([
            'clinicaltables.nlm.nih.gov/api/*' => Http::response($mocked = $this->getMockResponse(), 200, []),
        ]);
        $expected = array_map(fn ($item) => ['value' => $item[0], 'label' => $item[0] . ' - ' . $item[1]], $mocked[3]);
        $response = $this->json('POST', $route, ['term' => 'A2']);
        // validate response code
        $response->assertStatus(200);
        // expected response
        $this->assertEquals($response->json(), $expected);
    }

    protected function getMockResponse()
    {
        return [
            0 => 47,
            1 => [
                0 => 'A20.0',
                1 => 'A20.1',
                2 => 'A20.2',
            ],
            2 => null,
            3 => [
                0 => [
                    0 => 'A20.0',
                    1 => 'Bubonic plague',
                ],
                1 => [
                    0 => 'A20.1',
                    1 => 'Cellulocutaneous plague',
                ],
                2 => [
                    0 => 'A20.2',
                    1 => 'Pneumonic plague',
                ],
            ],
        ];
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());
        Bouncer::sync($this->user)->roles(['hp_user']);
        $this->user->save();
        Passport::actingAs(
            $this->user
        );
    }
}
