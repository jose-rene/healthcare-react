<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class FormSection extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description',
        'assessment_id',
        'url',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
