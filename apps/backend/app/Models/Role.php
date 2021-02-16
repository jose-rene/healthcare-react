<?php

namespace App\Models;

use Silber\Bouncer\Database\Role as BouncerRole;

class Role extends BouncerRole
{
    protected $fillable = ['domain', 'name', 'title', 'level'];

    /**
     * Get roles for a domain.
     *
     * @return null | Illuminate\Database\Eloquent\Collection of App\Models\Role
     */
    public function getByDomain($domain)
    {
        return $this->where(['domain' => $domain])->orderBy('title', 'asc')->get();
    }
}
