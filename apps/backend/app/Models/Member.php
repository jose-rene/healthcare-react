<?php

namespace App\Models;

use App\Http\SearchPipeline\Dob;
use App\Http\SearchPipeline\FirstName;
use App\Http\SearchPipeline\LastName;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pipeline\Pipeline;

class Member extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;

    protected $guarded = ['id'];

    /**
     * Relationship to requests.
     */
    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    /**
     * Relationship to addresses.
     */
    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
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

    public function scopeSearchMembers($query, User $authedUser = null)
    {
        if (!$authedUser) {
            $authedUser = auth()->user();
        }

        if (1 !== $authedUser->user_type) { // limit search to their own plan
            $query->where('payer_id', $authedUser->healthPlanUser->payer->id);
        }

        return app(Pipeline::class)
            ->send($query)
            ->through([
                Dob::class,
                LastName::class,
                FirstName::class,
            ])
            ->thenReturn();
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
