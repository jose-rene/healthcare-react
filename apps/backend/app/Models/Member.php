<?php

namespace App\Models;

use App\Events\MemberCreated;
use App\Http\SearchPipeline\Dob;
use App\Http\SearchPipeline\FirstName;
use App\Http\SearchPipeline\LastName;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pipeline\Pipeline;

/**
 * @property mixed            payer
 * @property Lob              lob
 * @property string           member_number
 * @property string           member_number_type
 * @property TrainingDocument trainingDocuments
 */
class Member extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;

    protected $fillable = [
        'payer_id',
        'lob_id',
        'member_number',
        'language_id',
        'line_of_business',
        'member_number_type',
        'gender',
        'name_title',
        'first_name',
        'last_name',
        'dob',
        'is_test',
    ];

    protected $dispatchesEvents = [
        'created' => MemberCreated::class,
    ];

    protected $casts = ['is_test' => 'boolean'];

    /**
     * Relationship to requests.
     */
    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    /**
     * Relationship to requests.
     */
    public function memberRequests()
    {
        return $this->hasMany(Request::class, 'member_id');
    }

    /**
     * Relationship to addresses.
     */
    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable')->orderBy('is_primary', 'desc');
    }

    public function address()
    {
        return $this->addresses()->firstOrCreate([
            'is_primary'  => true,
            'street'      => '',
            'city'        => '',
            'county'      => '',
            'state'       => '',
            'postal_code' => '',
        ]);
    }

    /**
     * Relationship to phones.
     *
     *  @return Illuminate\Database\Eloquent\Collection of App\Models\Phone
     */
    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable')
            ->orderBy('is_primary', 'desc')
            ->orderBy('updated_at', 'desc');
    }

    /**
     * Relationship to emails.
     *
     *  @return Illuminate\Database\Eloquent\Collection of App\Models\Email
     */
    public function emails()
    {
        return $this->morphMany(Email::class, 'emailable')
            ->orderBy('is_primary', 'desc')
            ->orderBy('updated_at', 'desc');
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

    public function language()
    {
        return $this->hasOne(Language::class);
    }

    /**
     * Relationship to lob.
     *
     * @return App\Models\Lob
     */
    public function lob()
    {
        return $this->belongsTo(Lob::class);
    }

    /**
     * Relationship to history.
     */
    public function history()
    {
        return $this->hasMany(MemberPayerHistory::class);
    }

    /**
     * Contact list attribute.
     *
     * @return App\Models\Payer
     *
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getContactsAttribute()
    {
        return $this->phones->merge($this->emails);
    }

    public function getMainPhoneAttribute()
    {
        return $this->phones()->first();
    }

    public function getMainEmailAttribute()
    {
        return $this->emails()->first();
    }

    public function getNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getTrainingDocumentsAttribute()
    {
        return $this->payer->trainingDocuments;
    }

    public function scopeSearchMembers($query, User $authedUser = null)
    {
        if (empty($authedUser)) {
            $authedUser = auth()->user();
        }

        if (1 !== $authedUser->user_type) {
            // limit search to their own plan
            if (!$authedUser->payer) {
                return null;
            }
            // check for payer children
            if ($authedUser->payer->payers->count()) {
                $payerIds = $authedUser->payer->payers->flatten()->pluck('id');
                $payerIds->push($authedUser->payer->id);
                $query->whereIn('payer_id', $payerIds);
            } else {
                $query->where('payer_id', $authedUser->payer->id);
            }
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
