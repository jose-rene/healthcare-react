<?php

namespace App\Providers;

use App\Library\FmDataApi;
use App\Models\Role;
use Bouncer;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

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
    }
}
