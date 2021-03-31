<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class RelevantDiagnoses extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'request_id',
        'code',
        'description',
        'weighted',
    ];

    protected $casts = [
        'weighted' => 'boolean',
    ];
}
