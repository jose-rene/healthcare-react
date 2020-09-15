<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 */
class Questionnaire extends Model
{
    use HasFactory;

    protected $guarded = [
        'id',
    ];

    /**
     * Relationship to sections.
     *
     * @return Illuminate\Database\Eloquent\Collection of Section
     */
    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    /**
     * Relationship to assessments.
     *
     * @return Illuminate\Database\Eloquent\Collection of Assessments
     */
    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }
}
