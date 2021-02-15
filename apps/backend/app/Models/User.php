<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Arr;
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
        'notification_prefs' => 'array',
    ];

    public function getNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable');
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

    public function OathClients()
    {
        return $this->hasMany(OathClients::class);
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
