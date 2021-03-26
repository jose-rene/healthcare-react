<?php

namespace App\Models;

use App\Models\Assessment\Section;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property Section questionnaireSection
 */
class RequestQuestionnaireSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'request_id',
        'questionnaire_section_id',
        'data',
    ];

    public function questionnaireSection()
    {
        return $this->belongsTo(Section::class, 'questionnaire_section_id');
    }

    public function getQuestionnaireAttribute()
    {
        return $this->questionnaireSection->questionnaire;
    }
}
