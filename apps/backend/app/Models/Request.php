<?php

namespace App\Models;

use App\Http\SearchPipeline\AuthNumber;
use App\Http\SearchPipeline\Dates;
use App\Http\SearchPipeline\RequestStatusId;
use App\Http\SearchPipeline\TherapyNetworkId;
use App\Models\Activity\Activity;
use App\Models\Assessment\Assessment;
use App\Traits\Revisionable;
use App\Traits\Uuidable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pipeline\Pipeline;

/**
 * @property Carbon             created_at
 * @property RequestItem        requestItems
 * @property int                id
 * @property Member             member
 * @property Document           documents
 * @property string             uuid
 * @property Activity           activities
 * @property User               therapist
 * @property User               reviewer
 * @property User               admin
 * @property RequestFormSection $requestFormSections
 *
 * @observer App\Observers\RequestObserver
 */
class Request extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;
    use Revisionable;

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
    protected $casts = ['due_at_na' => 'boolean'];

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

    public function requestDates()
    {
        return $this->hasMany(RequestDate::class, 'request_id')->orderBy('id', 'desc');
    }

    public function requestStatus()
    {
        return $this->belongsTo(RequestStatus::class);
    }

    public function requestTypes()
    {
        return $this->hasManyThrough(RequestType::class, RequestItem::class);
    }

    public function requestItems()
    {
        return $this->hasMany(RequestItem::class);
    }

    public function relevantDiagnoses()
    {
        return $this->hasMany(RelevantDiagnoses::class)->orderBy('id');
    }

    public function requestFormSections()
    {
        return $this->hasMany(RequestFormSection::class);
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

    public function clinician()
    {
        return $this->belongsTo(User::class, 'clinician_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function hpUser()
    {
        return $this->hasOne(Member::class, 'payer_user_id');
    }

    public function payerUser()
    {
        return $this->hasOne(Member::class, 'payer_user_id');
    }

    public function scopeSearch($query, User $user)
    {
        switch ($user->user_type) {
            // business admin and engineering can see all requests
            case 1:
            case 4:
                break;
            case 2: // healthplan
                $payerIds = [];
                // add child payers if applicable
                if (null !== ($childPayers = $user->healthPlanUser->payer->children)) {
                    $payerIds = $childPayers->pluck('id')->all();
                }
                // add the users associated payer
                array_unshift($payerIds, $user->healthPlanUser->payer_id);
                $query->whereIn('payer_id', $payerIds);
                break;
            case 3: // therapist
                $query->where('clinician_id', $user->id);
                break;
            default:
                return null;
                break;
        }

        return app(Pipeline::class)
            ->send($query)
            ->through([
                RequestStatusId::class,
                AuthNumber::class,
                Dates::class,
                TherapyNetworkId::class,
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

    public function getRequestedAtAttribute()
    {
        return $this->created_at;
    }

    public function getAppointmentDateAttribute()
    {
        $appt = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', 3) : null;
        return $appt ? $appt->date : null;
    }

    public function getReceivedDateAttribute()
    {
        $received = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', 1) : null;
        return $received ? $received->date : $this->created_at;
    }

    public function getCalledDateAttribute()
    {
        $called = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', 2) : null;
        return $called ? $called->date : null;
    }

    public function getStatusNameAttribute()
    {
        return $this->requestStatus ? $this->requestStatus->name : 'In Progress';
    }

    public function getMemberVerifiedAttribute()
    {
        return (bool) $this->member_verified_at;
    }
}
