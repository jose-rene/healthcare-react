<?php

namespace App\Models;

use App\Models\Activity\Activity;
use App\Models\Assessment\Assessment;
use App\Traits\Uuidable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property Carbon created_at
 */
class Request extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;

    protected $guarded = ['id'];

    protected $dates = ['due_at'];

    /**
     * Relationship to assessments.
     *
     * @return HasMany of App\Models\Assessment\Assessment
     */
    public function assessments()
    {
        return $this->hasMany(Assessment::class)->orderBy('id', 'desc');
    }

    public function requestDate()
    {
        return $this->hasMany(RequestDate::class, 'request_id');
    }

    public function requestType()
    {
        return $this->hasOne(RequestType::class, 'request_type_id');
    }

    public function requestItems()
    {
        return $this->hasMany(RequestItem::class, 'request_id');
    }

    public function requestQuestionnaireSection()
    {
        return $this->hasMany(RequestQuestionnaireSection::class, 'request_id');
    }

    /**
     * Relationship to members.
     *
     * @return Member|BelongsTo
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Relationship to members.
     *
     * @return HasOne
     */
    public function memberAddress()
    {
        return $this->hasOne(Address::class, 'member_address_id');
    }

    /**
     * Relationship to activities.
     *
     * @return HasMany of App\Models\Activity\Activity
     */
    public function activities()
    {
        return $this->hasMany(Activity::class)->orderBy('id', 'desc');
    }

    public function scopeSearch($query)
    {
        // TODO :: implement the search pipeline
        return $query;
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

    public function getRequestedAtAttributes()
    {
        return $this->created_at;
    }
}
