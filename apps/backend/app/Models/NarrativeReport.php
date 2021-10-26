<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property mixed $narrative_report_template_id
 * @property mixed $template
 * @property mixed $object_name
 * @property mixed $request_id
 * @property mixed $text
 */
class NarrativeReport extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'narrative_report_template_id',
        'object_name', //S3 object name
        'request_id',
        'text', // formatted report text
    ];

    public function template()
    {
        return $this->belongsTo(NarrativeReportTemplate::class, 'narrative_report_template_id');
    }
}
