<?php

namespace App\Models\UserType;

use App\Http\SearchPipeline\Admin\ClinicalUserStatusId;
use App\Models\ClinicalType;
use App\Models\ClinicalUserStatus;
use App\Models\ClinicalUserType;
use App\Models\TherapyNetwork;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClinicalServicesUser extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clinical_users';

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
        return $this->belongsTo(ClinicalType::class, 'clinical_type_id')->select(['id', 'name']);
    }

    public function userType()
    {
        return $this->belongsTo(ClinicalUserType::class, 'clinical_user_type_id')->select(['id', 'name']);
    }

    public function status()
    {
        return $this->belongsTo(ClinicalUserStatus::class, 'clinical_user_status_id')->select(['id', 'name']);
    }

    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function reviewerRequests()
    {
        return $this->hasMany(Request::class, 'reviewer_id');
    }

    public function therapyNetwork()
    {
        return $this->belongsTo(TherapyNetwork::class, 'therapy_network_id')->select(['id', 'name']);
    }

    public function scopeSearchAllUsers($query, self $authedUser)
    {
        return app(Pipeline::class)
            ->send($query)
            ->through([
                ClinicalUserStatusId::class,
            ])
            ->thenReturn();
    }

    /*
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
