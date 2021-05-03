<?php

namespace Tests\Feature;

use App\Models\Activity\Activity;
use App\Models\Request;
use App\Models\User;
use App\Notifications\RequestActivity;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ActivityNotificationTest extends TestCase
{
    use RefreshDatabase;

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
        // creating an activity should trigger notification
        $request = Request::factory()->create();

        $this->activity = $request->activities()->first();

        $a    = Activity::with('activityType')->get();
        $stop = $a->toArray();

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
        $this->user = User::factory()->create();
    }
}
