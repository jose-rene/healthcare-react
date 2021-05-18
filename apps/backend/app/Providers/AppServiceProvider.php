<?php

namespace App\Providers;

use App\Channels\SmsChannel;
use App\Library\FmDataApi;
use App\Models\Role;
use Bouncer;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\ServiceProvider;
use Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(FmDataApi::class, function ($app) {
            return new FmDataApi();
        });

        $storageName = config('filesystems.defaultTraining');
        config()->push('filesystems.trainingStorage', config("filesystems.disks.{$storageName}"));
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // this will remove the data wrap from resources, axios on the client will wrap response body with data key
        JsonResource::withoutWrapping();
        // use custom role class with bouncer
        Bouncer::useRoleModel(Role::class);
        // sms notifications
        Notification::extend('sms', function ($app) {
            return new SmsChannel($app->make('aws')->createClient('sns'));
        });

        Route::macro('frontendUrl', function ($path = '/') {
            $url = rtrim(config('app.frontend_url', 'http://localhost'), '/');

            return $url . '/' . ltrim($path, '/');
        });
    }
}
