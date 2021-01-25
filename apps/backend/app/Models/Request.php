<?php

namespace App\Models;

use App\Models\Assessment\Assessment;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Request extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;

    protected $guarded = ['id'];

    /**
     * Relationship to assessments.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Assessment\Assessment
     */
    public function assessments()
    {
        return $this->hasMany(Assessment::class)->orderBy('id', 'desc');
    }

    /**
     * Relationship to members.
     *
     * @return Member
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
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
