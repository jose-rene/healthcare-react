<?php

namespace App\Models\Assessment;

use App\Models\Assessment\Valuelist\Valuelist;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // dependencies json data to object
    protected $casts = [
        'dependencies' => 'object',
        'position'     => 'integer',
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
