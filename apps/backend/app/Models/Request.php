<?php

namespace App\Models;

use App\Http\SearchPipeline\AuthNumber;
use App\Http\SearchPipeline\RequestStatusId;
use App\Http\SearchPipeline\Sort;
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
use Illuminate\Support\Str;
use RuntimeException;

/**
 * @property Carbon             created_at
 * @property RequestItem        requestItems
 * @property int                id
 * @property Member             member
 * @property Member             $hpUser
 * @property Document           documents
 * @property string             uuid
 * @property Activity           activities
 * @property User               therapist
 * @property User               reviewer
 * @property User               admin
 * @property Carbon             $assessed_date
 * @property RequestFormSection $requestFormSections
 * @property RelevantDiagnoses  $relevantDiagnoses
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
    protected $casts = [
        'due_at_na'          => 'boolean',
        'documents_na'       => 'boolean',
        'classification_id'  => 'integer',
        'notification_prefs' => 'array',
    ];

    /**
     * Relationship to assessments.
     *
     * @return HasMany of App\Models\Assessment\Assessment
     */
    public function assessments()
    {
        return $this->hasMany(Assessment::class)->orderBy('id', 'desc');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'request_id')->orderBy('id', 'desc');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function requestDocuments()
    {
        return $this->morphMany(Document::class, 'documentable')->where('document_type_id', 1);
    }

    public function media()
    {
        return $this->morphMany(Document::class, 'documentable')->where('document_type_id', 2)->orderBy('position', 'asc');
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
        return $this->hasMany(Activity::class)->whereNull('parent_id')->orderBy('id', 'desc');
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

    public function classification()
    {
        return $this->belongsTo(Classification::class, 'classification_id');
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
        return $this->belongsTo(Member::class, 'payer_user_id');
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
                if ('field_clinician' === $user->primary_role) {
                    $query->where('clinician_id', $user->id);
                }
                elseif ('clinical_reviewer' === $user->primary_role) {
                    if (request()->has('is_clinician') && request()->get('is_clinician')) {
                        $query->where('clinician_id', $user->id);
                    }
                    else {
                        $query->where('reviewer_id', $user->id);
                    }
                }
                elseif ('reviewer_manager' === $user->primary_role) {
                    // can see all requests
                }
                else {
                    // these aren't supported yet
                    return null;
                }
                break;
            default:
                return null;
                break;
        }

        // save search prefs
        if ($user->searchSettings != ($searchPrefs = request()->all())) {
            $user->searchSettings = $searchPrefs;
            $user->save();
        }

        // my stuff
        if (request()->has('filter') && request()->get('filter')) {
            $query->where('payer_user_id', $user->id);
        }

        // lookup, just search by member and auth number on a lookup term
        if (request()->has('lookup') && ($lookup = request()->get('lookup'))) {
            return $query->where(function($query) use($lookup) {
                $query->where('auth_number', 'LIKE', '%' . $lookup . '%')
                ->OrWhereHas('member', function ($query) use($lookup) {
                    $query->where(function($query) use($lookup) {
                        $query
                            ->where('first_name', 'LIKE', '%' . $lookup . '%')
                            ->orWhere('last_name', 'LIKE', '%' . $lookup . '%');
                    });
                });
            });
        }
        // date range
        if (request()->has('from_date') && ($fromDate = request()->get('from_date'))) {
            $query->where('created_at', '>=', $fromDate);
        }
        if (request()->has('to_date') && ($toDate = request()->get('to_date'))) {
            $query->where('created_at', '<=', $toDate . ' 23:59:59');
        }

        return app(Pipeline::class)
            ->send($query)
            ->through([
                RequestStatusId::class,
                AuthNumber::class,
                // Dates::class,
                TherapyNetworkId::class,
                Sort::class,
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

    public function getReceivedDateAttribute()
    {
        $received = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id',
            self::$received) : null;
        return $received ? $received->date : $this->created_at;
    }

    public function getCalledDateAttribute()
    {
        $called = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', self::$assigned) : null;
        return $called ? $called->date : null;
    }

    public function getAppointmentDateAttribute()
    {
        $appt = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', self::$scheduled) : null;
        return $appt ? $appt->date : null;
    }

    public function getAssessedDateAttribute()
    {
        $date = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', self::$assessed) : null;
        return $date ? $date->date : null;
    }

    public function getCancelledDateAttribute()
    {
        $date = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', self::$cancelled) : null;
        return $date ? $date->date : null;
    }

    public function getOnHoldDateAttribute()
    {
        $date = $this->requestDates ? $this->requestDates->firstWhere('request_date_type_id', self::$submitted) : null;
        return $date ? $date->date : null;
    }

    public function getAppointmentWindowAttribute()
    {
        if (null === $this->appointments || 0 === $this->appointments->count()) {
            return null;
        }
        $appt = $this->appointments->first();
        if (!$appt['start_time']) {
            return null;
        }

        return [
            'start' => $appt['start_time']->format('m/d/Y H:i:s'),
            'end'   => $appt['end_time']->format('m/d/Y H:i:s'),
        ];
    }

    public function getStatusNameAttribute()
    {
        return $this->requestStatus ? $this->requestStatus->name : 'In Progress';
    }

    public function getMemberVerifiedAttribute()
    {
        return (bool) $this->member_verified_at;
    }

    public function setStatusAttribute($statusName)
    {
        $status = Str::snake($statusName);
        if (!$statusId = self::${$status}) {
            throw new RuntimeException(sprintf('Invalid Request Status: %s', $statusName));
        }

        $this->request_status_id = $statusId;
    }

    public function getDefaultAssessmentAttribute()
    {
        // @todo use assessment rules to determine the default assessment
        /*if (null !== $this->assessments && 0 !== $this->assessments.count()) {
            return $this->assessments->first();
        }*/
        // this won't pass the correct instance
        $standardAssessment = Assessment::where('name', 'Standard Assessment');
        // this can be attached to assessments to support multiple assessments per request
        return $standardAssessment;
    }
}
