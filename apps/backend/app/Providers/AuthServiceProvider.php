<?php

namespace App\Providers;

use App\Models\Member;
use App\Models\Payer;
use App\Models\User;
use App\Policies\MemberPolicy;
use App\Policies\PayerPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        User::class   => UserPolicy::class,
        Payer::class  => PayerPolicy::class,
        Member::class => MemberPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
    }
}
