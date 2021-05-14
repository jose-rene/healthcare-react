<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class ClinicalUser extends Model
{
    use HasFactory, SoftDeletes;

    public $dates = ['date_hired'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'clinical_type_id',
        'clinical_user_status_id',
        'clinical_user_type_id',
        'therapy_network_id',
        'date_hired',
        'is_preferred',
        'is_test',
        'note',
        'title', // job title
        'user_id',
    ];
    protected $casts = [
        'is_preferred' => 'boolean',
        'is_test'      => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function type()
    {
        return $this->hasOne(ClinicalType::class, 'clinical_type_id');
    }

    public function userType()
    {
        return $this->hasOne(ClinicalUserType::class, 'clinical_user_type_id');
    }

    public function status()
    {
        return $this->hasOne(ClinicalUserStatus::class, 'clinical_user_status_id');
    }

    public function network()
    {
        return $this->hasOne(TherapyNetwork::class, 'therapy_network_id');
    }
}
