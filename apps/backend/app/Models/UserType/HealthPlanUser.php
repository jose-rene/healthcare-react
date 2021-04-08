<?php

namespace App\Models\UserType;

use App\Models\Payer;
use App\Models\Request;
use App\Models\User;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int   payer_id
 * @property Payer payer
 */
class HealthPlanUser extends Model
{
    use HasFactory, Uuidable, SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Relationship to user.
     *
     * @return App\Models\User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship to payer.
     *
     * @return App\Models\Payer
     */
    public function payer()
    {
        return $this->belongsTo(Payer::class);
    }

    public function requests()
    {
        return $this->hasMany(Request::class, 'payer_id');
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
