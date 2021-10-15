<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property Carbon $answer_data
 * @property Carbon $form_section_id
 * @property Carbon $request_id
 * @property Carbon $completed_at
 * @property Carbon $started_at
 * @property Form $sectionForm
 **/
class RequestFormSection extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'answer_data',
        'form_section_id',
        'request_id',
        'completed_at',
        'started_at',
    ];

    protected $casts = [
        'answer_data' => 'json',
    ];

    protected $dates = [
        'completed_at',
        'started_at',
    ];

    public function sectionForm()
    {
        return $this->belongsTo(Form::class, 'form_section_id');
    }

    public function formSection()
    {
        return $this->belongsTo(FormSection::class, 'form_section_id');
    }

    public function getFormAttribute()
    {
        return $this->formSection;
    }

    public function getIsStartedAttribute()
    {
        return (bool)$this->started_at;
    }

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }
}
