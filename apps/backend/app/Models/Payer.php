<?php

namespace App\Models;

use App\Models\Member;
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
     * @return App\Models\User
     */
    public function users()
    {
        return $this->hasManyThrough(HealthPlanUser::class, User::class);
    }

    /**
     * Relationship to members.
     *
     * @return App\Models\Member
     */
    public function members()
    {
        return $this->hasMany(Member::class);
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

    public function payerMember()
    {
        return $this->hasOne(PayerMemberId::class);
    }
}
