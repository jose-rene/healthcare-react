<?php

namespace App\Models\Assessment;

use App\Models\Assessment\Questionnaire;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

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
