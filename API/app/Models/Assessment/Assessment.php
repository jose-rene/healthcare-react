<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use App\Models\Assessment\Questionnaire;

class Assessment extends Model
{
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
}
