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

    public function answers()
    {
        return $this->hasMany(FormAnswer::class);
    }

    public function userAnswers()
    {
        return $this->answers()->userAnswers();
    }
}
