<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use App\Models\Assessment\Section;
use App\Models\Assessment\Valuelist\Valuelist;

class Question extends Model
{
    protected $guarded = ['id',];
    protected $hidden = ['created_at', 'updated_at'];
    // dependencies json data to object
    protected $casts = [
        'dependencies' => 'object',
    ];

    /**
     * Relationship to valuelist.
     *
     * @return Valuelist
     */
    public function valuelist()
    {
        return $this->belongsTo(Valuelist::class);
    }

    /**
     * Relationship to section.
     *
     * @return Section
     */
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}
