<?php

namespace App\Models\Assessment;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Questionnaire extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Uuidable;

    protected $guarded = ['id'];

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

    /*
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
