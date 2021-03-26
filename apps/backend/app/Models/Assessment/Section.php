<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int           id
 * @property Questionnaire questionnaire
 */
class Section extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $casts = ['position' => 'integer'];

    /**
     * Relationship to questions.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Question
     */
    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('position');
    }

    /**
     * Relationship to questionnaires.
     *
     * @return BelongsTo of App\Questionnaire
     */
    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class);
    }

    /**
     * Will return one level of children or child sections.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Questionnaire
     */
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('position');
    }

    /**
     * Will implement the recursive relationship and return the hiarchy of child sections.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Questionnaire
     */
    public function childSections()
    {
        return $this->hasMany(self::class, 'parent_id')->with('children');
    }
}
