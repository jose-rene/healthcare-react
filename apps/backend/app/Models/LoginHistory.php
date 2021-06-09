<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoginHistory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'ip',
        'browser',
        'browser_family',
        'browser_version',
        'browser_engine',
        'os',
        'os_family',
        'os_version',
        'device',
        'device_model',
        'ua',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
