<?php

namespace App\Models\Assessment\Valuelist;

use App\Models\Assessment\Question;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Valuelist extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Relationship to listitems.
     *
     * @return Illuminate\Database\Eloquent\Collection of Listitem
     */
    public function listitems()
    {
        return $this->hasMany(Listitem::class)->orderBy('listitem_id');
    }

    /**
     * Relationship to questions.
     *
     * @return Illuminate\Database\Eloquent\Collection of Question
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
