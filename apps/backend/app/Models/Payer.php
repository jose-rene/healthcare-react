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

    /**
     * Relationship to lines of business.
     *
     * @return App\Models\Lob
     */
    public function lobs()
    {
        return $this->belongsToMany(Lob::class)
            ->using(LobPayer::class)
            ->withPivot([
                'id',
                'alias_name',
                'is_tat_enabled',
                'is_tat_default_na',
                'is_tat_required',
                'payer_rate',
                'clinician_rate',
                'reviewer_rate',
            ]);
    }

    /**
     * Returns one level of children or child payers.
     *
     * @return Illuminate\Database\Eloquent\Collection of Payer
     */
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('name');
    }

    /**
     * Will implement the recursive relationship and return the hiarchy of child payers.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Questionnaire
     */
    public function payers()
    {
        return $this->hasMany(self::class, 'parent_id')->with('children');
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
