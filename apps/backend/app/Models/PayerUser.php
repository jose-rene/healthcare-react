<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class PayerUser extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'is_locked',
        'is_test',
        'payer_id',
        'title',
        'user_id',
    ];

    protected $casts = [
        'is_locked' => 'boolean',
        'is_test'   => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payer()
    {
        return $this->belongsTo(Payer::class);
    }
}
