<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use App\Models\Assessment\Valuelist\Listitem;

class Answer extends Model
{
    protected $guarded = [
        'id',
    ];

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
     * Relationship to listitem.
     *
     * @return App\Models\Assessment\Valuelist\Listitem
     */
    public function listitem()
    {
        return $this->belongsTo(Listitem::class);
    }
}
