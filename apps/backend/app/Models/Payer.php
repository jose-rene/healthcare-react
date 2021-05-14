<?php

namespace App\Models;

use App\Events\PayerCreated;
use App\Models\UserType\HealthPlanUser;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Payer
 * @package App\Models
 * @property TrainingDocument trainingDocuments
 */
class Payer extends Model
{
    use HasFactory, Uuidable, SoftDeletes;

    protected $fillable = [
        'name',
        'abbreviation',
        'assessment_label',
        'billing_document_type',
        'coupa_business_name',
        'coupa_cxml_template',
        'coupa_identity',
        'coupa_shared_secret',
        'coupa_url',
        'criteria',
        'per_request_average_high',
        'per_request_average_low',
        'tat_default_time',
        'tat_lead_red',
        'tat_lead_yellow',

        'is_test',

        'billing_frequency_id', // TODO needs relationship
        'email_security_option_id', // TODO needs relationship
        'payer_type_id', // TODO needs relationship
    ];

    protected $dispatchesEvents = [
        'created' => PayerCreated::class,
    ];

    protected $casts = [
        'is_test' => 'boolean',
    ];

    /**
     * Relationship to users.
     *
     * @return App\Models\User
     */
    public function users()
    {
        return $this->hasManyThrough(
            User::class,
            HealthPlanUser::class,
            'user_id',// Foreign key on the HealthPlanUser table...
            'id',     // Foreign key on the User table...
            'id',     // Local key on the Payer table...
            'user_id' // Local key on the HealthPlanUser table...
        );
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
        return $this->hasMany(Lob::class);
    }

    /**
     * Relationship to payer member number types.
     *
     * @return App\Models\PayerMemberNumberType
     */
    public function memberNumberTypes()
    {
        return $this->hasMany(PayerMemberNumberType::class);
    }

    /**
     * Relationship to request types.
     *
     * @return Illuminate\Database\Eloquent\Collection of RequestType
     */
    public function requestTypes()
    {
        return $this->hasMany(RequestType::class)->orderBy('name');
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

    public function getTrainingDocumentsAttribute()
    {
        return TrainingDocument::query()
            ->whereNull('payer_id')->orWhere('payer_id', $this->id)
            ->orderBy('training_document_type_id')
            ->orderBy('mime_type')
            ->orderBy('name', 'desc')
            ->get();
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
