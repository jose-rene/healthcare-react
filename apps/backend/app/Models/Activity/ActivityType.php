<?php

namespace App\Models\Activity;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityType extends Model
{
    use HasFactory;

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
