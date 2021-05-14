<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
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
    ];

    protected $casts = [
        'answer_data' => 'json',
    ];

    public function formSection()
    {
        return $this->belongsTo(FormSection::class, 'form_section_id');
    }

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }
}
