<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class Rate extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'priority',

        'clinician_rate',
        'consultant_rate',
        'payer_rate',
        'reviewer_rate',

        'clinical_user_id',
        'payer_id',
        'lob_id',
        'request_type_id',
        'therapy_network_id',
    ];

    public function clinicalUser()
    {
        return $this->belongsTo(ClinicalUser::class, 'clinical_user_id');
    }

    public function payer()
    {
        return $this->belongsTo(Payer::class, 'payer_id');
    }

    public function lob()
    {
        return $this->belongsTo(Lob::class, 'lob_id');
    }

    public function requestType()
    {
        return $this->belongsTo(RequestType::class, 'request_type_id');
    }

    public function therapyNetwork()
    {
        return $this->belongsTo(TherapyNetwork::class, 'therapy_network_id');
    }
}
