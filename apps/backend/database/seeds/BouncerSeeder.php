<?php

namespace Database\Seeders;

use Bouncer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BouncerSeeder extends Seeder
{
    protected $adminPermissions = [
        'View users',
        'Create users',
        'Force delete users',
        'Create payers',
        'Force delete payers',
        'Create Members',
        'Force delete members',
        'Work Gryphon',
    ];

    protected $hpPermissions = [
        'View Invoices',
        'View Reports',
        'View Members',
        'Create Members',
        'View Payers',
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // create abilities to apply to roles
        foreach ($this->adminPermissions as $title) {
            Bouncer::ability()->firstOrCreate(['name' => Str::snake($title, '-'), 'title' => $title]);
        }
        foreach ($this->hpPermissions as $title) {
            Bouncer::ability()->firstOrCreate(['name' => Str::snake($title, '-'), 'title' => $title]);
        }
        // add software dev role
        $super = Bouncer::role()->firstOrCreate([
            'domain' => 'Engineering',
            'name'   => 'software_engineer',
            'title'  => 'Software Engineer',
        ]);

        Bouncer::allow($super)->to('create-users');
        Bouncer::allow($super)->to('force-delete-users');
        Bouncer::allow($super)->to('create-members');
        Bouncer::allow($super)->to('create-payers');
        Bouncer::allow($super)->to('force-delete-payers');
        Bouncer::allow($super)->to('force-delete-members');
        Bouncer::allow($super)->to('work-gryphon');

        // add admin user roles
        $adminRoles = [
            'coo'                        => 'Chief Operations Officer',
            'client_services_manager'    => 'Client Services Manager',
            'client_services_specialist' => 'Client Services Specialist',
        ];
        foreach ($adminRoles as $name => $title) {
            $role = Bouncer::role()->firstOrCreate([
                'domain' => 'Business Operations',
                'name'   => $name,
                'title'  => $title,
            ]);
            // apply admin roles
            foreach ($this->adminPermissions as $ability) {
                Bouncer::allow($role)->to(Str::snake($ability, '-'));
            }
        }

        // make adding roles outside of your domain an ability
        $applyAnyRole = Bouncer::ability()->firstOrCreate([
            'name'  => 'apply-any-role',
            'title' => 'Apply any role',
        ]);
        // apply to supers
        Bouncer::allow($super)->to($applyAnyRole);

        // add health plan user roles
        $hpRoles = [
            'hp_user'     => 'HP User',
            'hp_finance'  => 'HP Finance',
            'hp_champion' => 'HP Champion',
            'hp_manager'  => 'HP Manager',
        ];
        foreach ($hpRoles as $name => $title) {
            $role = Bouncer::role()->firstOrCreate([
                'domain' => 'Health Plan',
                'name'   => $name,
                'title'  => $title,
            ]);
            Bouncer::allow($role)->to('view-members');
            Bouncer::allow($role)->to('create-members');
            Bouncer::allow($role)->to('view-payers');
            if ('hp_champion' === $name || 'hp_manager' === $name) {
                // allow to create users
                Bouncer::allow($role)->to('create-users');
            }
        }
    }
}
