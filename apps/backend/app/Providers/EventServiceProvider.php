<?php

namespace App\Providers;

use App\Events\ActivityCreated;
use App\Events\DocumentCreated;
use App\Events\MemberCreated;
use App\Events\PayerCreated;
use App\Events\RequestFormSectionSavedEvent;
use App\Events\RequestStatusChangedEvent;
use App\Events\UserChangingPassword;
use App\Events\UserLoggedIn;
use App\Listeners\ActivityCreatedListener;
use App\Listeners\ChangeResetPasswordFalse;
use App\Listeners\DatabaseRefreshedListener;
use App\Listeners\DocumentCreatedListener;
use App\Listeners\MemberCreatedListener;
use App\Listeners\PayerCreatedListener;
use App\Listeners\RequestChangedListener;
use App\Listeners\TrackDatabaseChangeListener;
use App\Listeners\TrackPasswordResets;
use App\Listeners\UserLoggedInListener;
use App\Models\Appointment;
use App\Models\Request;
use App\Observers\AppointmentObserver;
use App\Observers\RequestObserver;
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
        Registered::class           => [
            SendEmailVerificationNotification::class,
        ],
        UserChangingPassword::class => [
            TrackPasswordResets::class,
            ChangeResetPasswordFalse::class,
        ],
        MigrationsEnded::class      => [
            TrackDatabaseChangeListener::class,
        ],
        DatabaseRefreshed::class            => [
            DatabaseRefreshedListener::class,
        ],
        ActivityCreated::class              => [
            ActivityCreatedListener::class,
        ],
        DocumentCreated::class              => [
            DocumentCreatedListener::class,
        ],
        MemberCreated::class                => [
            MemberCreatedListener::class,
        ],
        PayerCreated::class                 => [
            PayerCreatedListener::class,
        ],
        UserLoggedIn::class                 => [
            UserLoggedInListener::class,
        ],
        RequestFormSectionSavedEvent::class => [
        ],
        RequestStatusChangedEvent::class    => [
            RequestChangedListener::class,
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

        Appointment::observe(AppointmentObserver::class);
        Request::observe(RequestObserver::class);
    }
}
