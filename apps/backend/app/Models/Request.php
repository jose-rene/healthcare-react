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
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property Carbon      created_at
 * @property RequestItem requestItems
 * @property int         id
 * @property Member      member
 * @property Document    documents
 */
class Request extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;

    public static $received = '1';
    public static $assigned = '2';
    public static $scheduled = '3';
    public static $assessed = '4';
    public static $submitted = '5';
    public static $completed = '6';
    public static $on_hold = '7';
    public static $cancelled = '8';
    public static $reopened = '9';

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

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function requestDate()
    {
        return $this->hasMany(RequestDate::class, 'request_id');
    }

    public function requestStatus()
    {
        return $this->belongsTo(RequestStatus::class);
    }

    public function requestType()
    {
        return $this->hasOne(RequestType::class, 'request_type_id');
    }

    public function requestItems()
    {
        return $this->hasMany(RequestItem::class, 'request_id');
    }

    public function relevantDiagnoses()
    {
        return $this->hasMany(RelevantDiagnoses::class, 'request_id');
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
     * @return Address
     */
    public function getMemberAddressAttribute()
    {
        return $this->member->addresses()->first();
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

    /**
     * Relationship to payer.
     *
     * @return BelongsTo of App\Models\Payer
     */
    public function payer()
    {
        return $this->belongsTo(Payer::class);
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

    public function getRequestedAtAttribute()
    {
        return $this->created_at;
    }

    public function getStatusNameAttribute()
    {
        return $this->requestStatus->name ?? '';
    }

    public function getMemberVerifiedAttribute()
    {
        return (bool)$this->member_verified_at;
    }
}
