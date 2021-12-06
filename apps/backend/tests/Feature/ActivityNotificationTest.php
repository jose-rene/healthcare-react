<?php

namespace Tests\Feature;

use App\Models\Activity\Activity;
use App\Models\UserType\HealthplanUser;
use App\Models\Request;
use App\Models\User;
use App\Notifications\RequestActivity;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Notification;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ActivityNotificationTest extends TestCase
{
    use RefreshDatabase, withFaker;

    protected $user;
    protected $activity;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testNotification()
    {
        Notification::fake();
        // make a request
        $request = Request::factory()->create(['request_status_id' => 1]);

        // update to trigger activity
        $route = route('api.request.update', [
            'request' => $request->uuid,
        ]);
        // updating due date should trigger request updated activity
        $response = $this->put($route, [
            'type_name' => 'due',
            'due_at'    => $due_at = $this->faker->dateTimeBetween('+1 day', '+2 weeks'),
        ]);
        $response->assertSuccessful();

        $this->activity = $request->activities()->first();
        // check that activity exists
        $this->assertNotNull($this->activity);

        Notification::send($this->activity->user, new RequestActivity($this->activity));

        Notification::assertSentTo(
            $this->activity->user,
            RequestActivity::class,
            function ($notification, $channels) {
                // dd($notification->getActivityData(), $channels);
                // check channels or properties of $notification here
                return $channels == ['mail', 'database'];
            }
        );

        // Make sure only 1 notification is generated.
        self::assertCount(1, Activity::all());
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());
        Bouncer::sync($this->user)->roles(['hp_user']);
        Passport::actingAs(
            $this->user
        );
    }
}
