<?php

namespace App\Models\Activity;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class ActivityReason extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'activity_reason_type_id',
        'name',
        'slug',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(self::class, 'id', 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id', 'id');
    }

    public function activityReasonType()
    {
        return $this->belongsTo(ActivityReasonType::class, 'activity_reason_type_id');
    }
}
