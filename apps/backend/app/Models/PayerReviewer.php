<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class PayerReviewer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'clinical_user_id',
        'payer_id',
    ];

    public function payer()
    {
        return $this->belongsTo(Payer::class);
    }

    public function clinicalUser()
    {
        return $this->belongsTo(ClinicalUser::class, 'clinical_user_id');
    }
}
