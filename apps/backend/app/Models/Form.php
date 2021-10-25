<?php

namespace App\Models;

use App\Traits\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 *
 * @property int   $id
 * @property array $fields
 * @property string $slug
 * @property string $name
 * @property string $description
 * @property int $type_id
 */
class Form extends Model
{
    use HasFactory, SoftDeletes, Sluggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'slug',
        'name',
        'description',
        'type_id',
        'fields',
    ];

    protected $casts = [
        'fields' => 'json',
    ];

    /*
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function assessments() 
    {
        return $this->belongsToMany(Assessment::class, 'assessment_form');
    }

    public function answers()
    {
        return $this
            ->belongsToMany(Request::class, 'request_form_sections', 'form_section_id');
//            ->withPivot([
//                'answer_data',
//            ]);
    }

    public function userAnswers()
    {
        return $this->answers()->answer_data;
    }
}
