<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * @property mixed $narrative_report_template_id
 * @property mixed $template
 * @property mixed $object_name
 * @property mixed $request_id
 * @property mixed $text
 */
class NarrativeReport extends Model
{
    use HasFactory, SoftDeletes, RevisionableTrait;

    //Maintain a maximum of n changes at any point of time, while cleaning up old revisions.
    protected $historyLimit = 100;
    protected $revisionEnabled = true;
    protected $keepRevisionOf = ['text', 'narrative_report_template_id', 'request_id'];

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
