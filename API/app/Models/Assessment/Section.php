<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
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
        return $this->hasMany(Question::class);
    }

    /**
     * Relationship to questionnaires.
     *
     * @return Illuminate\Database\Eloquent\Collection of App\Questionnaire
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
        return $this->hasMany(self::class, 'parent_id');
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
