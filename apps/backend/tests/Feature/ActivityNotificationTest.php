<?php

namespace Tests\Feature;

use App\Models\Activity\Activity;
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
        $this->activity = Activity::factory()->create();
        Notification::assertSentTo($this->activity->user, RequestActivity::class, function ($notification, $channels) {
            // dd($notification->getActivityData(), $channels);
            // check channels or properties of $notification here
            return $channels == ['mail', 'database'];
        });
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        $this->user = User::factory()->create();
    }
}
