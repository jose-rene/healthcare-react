<?php

namespace App\Models;

use App\Models\UserType\HealthPlanUser;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payer extends Model
{
    use HasFactory, Uuidable, SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Relationship to users.
     *
     * @return App\Models\Payer
     */
    public function users()
    {
        return $this->hasManyThrough(HealthPlanUser::class, User::class);
    }

    /*
    * Get the route key for the model.
    *
    * @return string
    */
    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
