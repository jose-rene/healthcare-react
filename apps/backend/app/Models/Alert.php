<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class Alert extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'sms',
        'email',

        'alert_template_id',
        'subject',
        'body',

        'user_id',
        'owner_id',
        'request_role_id',
        'dismissed_by_id',

        'dismissed_at',
        'sent_at',

        'priority',
    ];

    protected $dates = ['dismissed_at', 'sent_at'];

    public function alertable()
    {
        return $this->morphTo();
    }

    public function template()
    {
        return $this->hasOne(AlertTemplate::class, 'alert_template_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dismissedBy()
    {
        return $this->belongsTo(User::class, 'dismissed_by_id');
    }
}
