<?php

namespace Database\Seeders;

use Bouncer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BouncerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // add software dev role
        $super = Bouncer::role()->firstOrCreate([
            'domain' => 'Engineering',
            'name'   => 'software_engineer',
            'title'  => 'Software Engineer',
        ]);
        // make creating users a special ability
        $create = Bouncer::ability()->firstOrCreate([
            'name'  => 'create-users',
            'title' => 'Create users',
        ]);
        // apply to supers
        Bouncer::allow($super)->to($create);

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
        }
        // allow HP Manager to create users
        Bouncer::allow($role)->to($create);

        // healthplan permissions
        $hpPermissions = ['View Invoices', 'View Reports'];
        foreach ($hpPermissions as $title) {
            Bouncer::ability()->firstOrCreate(['name' => Str::snake($name, '-'), 'title' => $title]);
        }
    }
}
