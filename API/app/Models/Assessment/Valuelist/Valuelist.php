<?php

namespace App\Models\Assessment\Valuelist;

use App\Models\Assessment\Question;
use Illuminate\Database\Eloquent\Model;

class Valuelist extends Model
{
    protected $guarded = ['id',];
    protected $hidden = ['created_at', 'updated_at'];

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
