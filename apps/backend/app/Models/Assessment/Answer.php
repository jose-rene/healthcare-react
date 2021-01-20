<?php

namespace App\Models\Assessment;

use App\Models\Assessment\Assessment;
use App\Models\Assessment\Valuelist\Listitem;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Relationship to questions.
     *
     * @return App\Models\Assessment\Question
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Relationship to assessments.
     *
     * @return App\Models\Assessment\Assessment
     */
    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    /**
     * Relationship to listitem.
     *
     * @return App\Models\Assessment\Valuelist\Listitem
     */
    public function listitem()
    {
        return $this->belongsTo(Listitem::class);
    }
}
