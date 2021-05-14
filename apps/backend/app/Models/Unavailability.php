<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class Unavailability extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'clinical_user_id',
        'date_end',
        'date_start',
        'description',
    ];

    protected $dates = ['date_end', 'date_start'];

    public function clinicalUser()
    {
        return $this->belongsTo(ClinicalUser::class, 'clinical_user_id');
    }
}
