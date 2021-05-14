<?php

namespace App\Models\Activity;

use App\Traits\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActivityType extends Model
{
    use HasFactory, SoftDeletes, Sluggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'slug',
        'name',
        'permission',
        'visible',
    ];

    /**
     * Relationship to activities.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Model\Activity\Activity
     */
    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}
