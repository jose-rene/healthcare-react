<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string  code
 * @property string  description
 * @property bool is_weighted
 * @property Request $request
 */
class RelevantDiagnoses extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'description',
        'is_weighted',
        'request_id',
    ];

    protected $casts = [
        'is_weighted' => 'boolean',
    ];

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }
}
