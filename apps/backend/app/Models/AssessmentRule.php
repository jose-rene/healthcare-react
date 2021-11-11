<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class AssessmentRule extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'assessment_id' => 'integer',
        'payer_id'      => 'integer',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'assessment_id',
        'payer_id',
        'classification_id',
        'request_type_id',
        'hcpc_id',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }
}
