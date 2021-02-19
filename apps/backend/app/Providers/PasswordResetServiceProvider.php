<?php

namespace App\Providers;

use App\Extension\PasswordBrokerManager;
use Illuminate\Auth\Passwords\PasswordResetServiceProvider as BasePasswordResetServiceProvider;

class PasswordResetServiceProvider extends BasePasswordResetServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = true;

    /**
     * Register the password broker instance.
     *
     * @return void
     */
    protected function registerPasswordBroker()
    {
        $this->app->singleton(
            'auth.password',
            function ($app) {
                return new PasswordBrokerManager($app);
            }
        );

        $this->app->bind(
            'auth.password.broker',
            function ($app) {
                return $app->make('auth.password')->broker();
            }
        );
    }
}
