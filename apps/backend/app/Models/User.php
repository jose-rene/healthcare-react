<?php

namespace App\Models;

use App\Models\UserType\ClinicalServicesUser;
use App\Models\UserType\EngineeringUser;
use App\Models\UserType\HealthplanUser;
use App\Models\Activity\Activity;
use App\Traits\Uuidable;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Laravel\Passport\HasApiTokens;
use Silber\Bouncer\Database\HasRolesAndAbilities;

/**
 * @property int    id
 * @property string name
 * @property string email
 * @property string middle_name
 * @property string first_name
 * @property string last_name
 * @link https://github.com/JosephSilber/bouncer#cheat-sheet
 */
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, Uuidable, HasApiTokens, SoftDeletes, HasRolesAndAbilities;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'primary_role',
        'last_name',
        'user_type',
        'notification_prefs',
        'dob',
        'email',
        'username',
        'password',
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
    ];

    protected static $userTypeMap = [
        1 => 'EngineeringUser',
        2 => 'HealthPlanUser',
        3 => 'ClinicalServicesUser',
    ];

    public function getNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
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
     * get the activity/ notifications for a user
     * @return HasMany
     */
    public function activity()
    {
        return $this->hasMany(Activity::class);
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
     * @return App\Models\UserType\HealthplanUser
     */
    public function healthplanUser()
    {
        return $this->hasOne(HealthplanUser::class);
    }

    /**
     * Relationship to Engineering User Type.
     *
     * App\Models\UserType\EngineeringUser
     */
    public function engineeringUser()
    {
        return $this->hasOne(EngineeringUser::class);
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
