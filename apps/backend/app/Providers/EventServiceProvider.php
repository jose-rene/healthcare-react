<?php

namespace App\Providers;

use App\Events\MemberCreated;
use App\Events\UserChangingPassword;
use App\Listeners\ChangeResetPasswordFalse;
use App\Listeners\DatabaseRefreshedListener;
use App\Listeners\MemberCreatedListener;
use App\Listeners\TrackDatabaseChangeListener;
use App\Listeners\TrackPasswordResets;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Database\Events\DatabaseRefreshed;
use Illuminate\Database\Events\MigrationsEnded;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UserChangingPassword::class => [
            TrackPasswordResets::class,
            ChangeResetPasswordFalse::class,
        ],
        MigrationsEnded::class => [
            TrackDatabaseChangeListener::class,
        ],
        DatabaseRefreshed::class => [
            DatabaseRefreshedListener::class,
        ],
        MemberCreated::class => [
            MemberCreatedListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }
}
