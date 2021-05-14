<?php

namespace App\Providers;

use App\Services\TwoFactorAuthApp;
use App\Services\TwoFactorAuthEmail;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class TwoFactorAuthProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(TwoFactorAuthApp::class, function ($app) {
            return new TwoFactorAuthApp();
        });

        $this->app->singleton(TwoFactorAuthEmail::class, function ($app) {
            return new TwoFactorAuthEmail();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
