<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class RequestTypesHcpc extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'request_type_id',
        'hcpcs_id',
    ];

    public function requestType()
    {
        return $this->hasOne(RequestType::class);
    }

    public function hcpcs()
    {
        return $this->belongsTo(Hcpc::class);
    }
}
