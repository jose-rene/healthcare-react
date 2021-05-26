<?php

namespace App\Models;

use App\Events\PayerCreated;
use App\Http\SearchPipeline\Address as AddressSearchPipe;
use App\Http\SearchPipeline\Name;
use App\Http\SearchPipeline\Phone as PhoneSearchPipe;
use App\Http\SearchPipeline\Sort;
use App\Models\UserType\HealthPlanUser;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pipeline\Pipeline;
use LasseRafn\InitialAvatarGenerator\InitialAvatar;

/**
 * Class Payer
 * @package App\Models
 * @property TrainingDocument trainingDocuments
 * @property mixed            avatar
 * @property string           name
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

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function getAvatarAttribute()
    {
        $image = $this->image;

        if ($image && $image->fileExists) {
            return $image->file;
        }

        $avatar = new InitialAvatar();

        return $avatar
            ->name($this->name)
            ->color(config('app.avatar_font_color'))
            ->background(config('app.avatar_back_color'))
            ->height(config('app.avatar_height'))
            ->width(config('app.avatar_width'))
            ->preferBold()
            ->generate()
            ->stream(config('app.avatar_image_type'));
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

    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable')->orderBy('is_primary', 'desc');
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

    public function getMainAddressAttribute()
    {
        return $this->addresses()->orderBy('is_primary')->first();
    }

    public function getMainPhoneAttribute()
    {
        return $this->phones()->first();
    }

    public function scopeSearchPayers($query)
    {
        return app(Pipeline::class)
            ->send($query)
            ->through([
                Name::class,
                PhoneSearchPipe::class,
                AddressSearchPipe::class,
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
}
