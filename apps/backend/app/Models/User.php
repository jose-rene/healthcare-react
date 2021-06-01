<?php

namespace App\Models;

use App\Http\SearchPipeline\Search;
use App\Http\SearchPipeline\UserRole;
use App\Http\SearchPipeline\UserSort;
use App\Models\Activity\Activity;
use App\Models\UserType\ClinicalServicesUser;
use App\Models\UserType\EngineeringUser;
use App\Models\UserType\HealthPlanUser;
use App\Traits\Uuidable;
use Carbon\Carbon;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Laravel\Passport\HasApiTokens;
use Nicolaslopezj\Searchable\SearchableTrait;
use Silber\Bouncer\Database\HasRolesAndAbilities;

/**
 * @property int             id
 * @property string          name
 * @property string          email
 * @property string          middle_name
 * @property string          first_name
 * @property string          last_name
 * @property PasswordHistory password_history
 * @property PasswordHistory last_n_passwords
 * @property Carbon          created_at
 * @property string          password
 * @property bool         reset_password
 * @property HealthPlanUser  healthPlanUser
 * @link https://github.com/JosephSilber/bouncer#cheat-sheet
 */
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, Uuidable, HasApiTokens, SoftDeletes, HasRolesAndAbilities, SearchableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'first_name',
        'primary_role',
        'last_name',
        'user_type',
        'notification_prefs',
        'dob',
        'email',
        'username',
        'password',
        'notification_type',
        'reset_password',
        'is_2fa',
        'google2fa_secret',
        'twofactor_method',
        'gender',
    ];

    protected $appends = ['full_name'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $dates = ['dob'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at'  => 'datetime',
        'notification_prefs' => 'json',
        'reset_password'     => 'boolean',
        'is_2fa'             => 'boolean',
    ];

    protected static $userTypeMap = [
        1 => 'EngineeringUser',
        2 => 'HealthPlanUser',
        3 => 'ClinicalServicesUser',
    ];

    protected $searchable = [
        /*
         * Columns and their priority in search results.
         * Columns with higher values are more important.
         * Columns with equal values have equal importance.
         *
         * @var array
         */
        'columns' => [
            'users.first_name' => 10,
            'users.last_name'  => 10,
            // 'users.user_type'  => 2,
            'users.email' => 5,
        ],
        //        'joins' => [
        //            'posts' => ['users.id','posts.user_id'],
        //        ],
    ];

    public function getNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getLastNPasswordsAttribute()
    {
        return $this->password_history()->limit(config('rules.last_n', 6))->get();
    }

    public function password_history(): HasMany
    {
        return $this->hasMany(PasswordHistory::class)->orderBy('created_at', 'desc');
    }

    /**
     * Relationship to phones.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Models\Phone
     */
    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable');
    }

    /**
     * get the activity/ notifications for a user.
     * @return HasMany
     */
    public function activity()
    {
        return $this->hasMany(Activity::class);
    }

    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    /**
     * Relationship to ClinicalServices User Type.
     *
     * @return App\Models\UserType\ClinicalServicesUser
     */
    public function clinicalServicesUser()
    {
        return $this->hasOne(ClinicalServicesUser::class);
    }

    /**
     * Relationship to Healthplan User Type.
     *
     * @return App\Models\UserType\HealthPlanUser
     */
    public function healthPlanUser()
    {
        return $this->hasOne(HealthPlanUser::class);
    }

    /**
     * Relationship to Engineering User Type.
     *
     * @return App\Models\UserType\EngineeringUser
     */
    public function engineeringUser()
    {
        return $this->hasOne(EngineeringUser::class);
    }

    /**
     * Get the Payer for healthplan users.
     *
     * @ return App\Models\Payer
     */
    public function getPayerAttribute()
    {
        if (2 !== $this->user_type) {
            return null;
        }

        return Arr::get($this->healthPlanUser, 'payer');
    }

    /**
     * Returns the full name of the user.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return sprintf('%s %s', $this->first_name, $this->last_name);
    }

    /**
     * Returns the name of the user type class.
     *
     * @return string
     */
    public function getUserTypeNameAttribute()
    {
        return empty($this->user_type) || !isset(self::$userTypeMap[$this->user_type]) ? '' : self::$userTypeMap[$this->user_type];
    }

    /**
     * Returns the domain of the user type class.
     *
     * @return string
     */
    public function getUserTypeDomainAttribute()
    {
        if ('' === ($name = $this->getUserTypeNameAttribute())) {
            return '';
        }

        return ucwords(Str::snake(str_replace('User', '', $name), ' '));
    }

    public function getAuthTokens($remember_me = false)
    {
        $tokenResult = $this->createToken('Personal Access Token');
        $token = $tokenResult->token;

        if ($remember_me) {
            $token->expires_at = Carbon::now()->addWeeks(1);
        }

        $token->save();

        return [
            'access_token' => $tokenResult->accessToken,
            'token_type'   => 'Bearer',
            'expires_at'   => Carbon::parse($tokenResult->token->expires_at)->toDateTimeString(),
        ];
    }

    /**
     * Creates the user type if it does not exist.
     *
     * @return object Illuminate\Database\Eloquent\Model
     */
    public function syncUserType()
    {
        // attach the user type
        $relationship = lcfirst($this->user_type_name);
        if (!$this->{$relationship}) {
            $class = 'App\\Models\\UserType\\' . $this->user_type_name;
            $userType = $class::create();
            $this->{$relationship}()->save($userType);
        }

        return $this->{$relationship}()->first();
    }

    public function OathClients()
    {
        return $this->hasMany(OathClients::class);
    }

    public static function mapType($className)
    {
        if (false === ($key = array_search($className, self::$userTypeMap))) {
            return 0;
        }

        return $key;
    }

    public static function mapTypeForDomain($domain)
    {
        $className = ucfirst(Str::camel($domain) . 'User');

        return self::mapType($className);
    }

    /**
     * Send the password reset notification.
     *
     * @param string $token
     * @return void
     */
    public function sendPasswordResetNotification($token): void
    {
        ResetPasswordNotification::$createUrlCallback = function ($notifiable, $token) {
            return Arr::get($_SERVER, 'HTTP_ORIGIN', 'dme-cg.com') . '/password/change?' . http_build_query([
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ]);
        };

        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Get the phone number for sms notifications.
     *
     * @param Notification $notification
     * @return string
     */
    public function routeNotificationForSms($notification)
    {
        if (null === $this->phoneable) {
            return null;
        }

        return $this->phonable->filter(function ($value, $key) {
            return $value->is_mobile;
        })->first();
    }

    public function scopeSearchAllUsers($query, self $authedUser)
    {
        if (1 !== $authedUser->user_type) { // limit search to their own domain
            $query->where('user_type', $authedUser->user_type);
        }

        return app(Pipeline::class)
            ->send($query)
            ->through([
                Search::class,
                UserRole::class,
                UserSort::class,
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
