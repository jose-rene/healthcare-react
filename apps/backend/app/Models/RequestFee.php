<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class RequestFee extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description',
        'date',
        'fee',
        'request_fee_type_id',
        'request_id',
    ];

    protected $dates = ['date'];

    protected $casts = ['fee' => 'number'];

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }

    public function type()
    {
        return $this->belongsTo(RequestFeeType::class, 'request_fee_type_id');
    }
}
