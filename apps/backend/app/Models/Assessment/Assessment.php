<?php

namespace App\Models\Assessment;

use App\Models\Request;
use App\Models\User;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assessment extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;

    protected $guarded = ['id'];

    /**
     * Relationship to questionnaire.
     *
     * @return Questionnaire
     */
    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class);
    }

    /**
     * Relationship to request.
     *
     * @return Request
     */
    public function request()
    {
        return $this->belongsTo(Request::class);
    }

    /**
     * Relationship to user.
     *
     * @return User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship to answers.
     *
     * @return Illuminate\Database\Eloquent\Collection of Section
     */
    public function answers()
    {
        return $this->hasMany(Answer::class);
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
