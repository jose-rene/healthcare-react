<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class NarrativeReportRecipient extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'bcc_email',
        'bcc_name',
        'cc_email',
        'cc_name',
        'to_email',
        'to_name',
        'is_use_default',
        'email_body',
        'email_subject',
        'payer_id',
        'narrative_report_submission_method_id',
        'narrative_report_template_id',
    ];

    protected $casts = ['is_use_default' => 'boolean'];

    /**
     * Relationship to payer.
     *
     * @return BelongsTo of App\Models\Payer
     */
    public function payer()
    {
        return $this->belongsTo(Payer::class);
    }

    public function template()
    {
        return $this->belongsTo(NarrativeReportTemplate::class, 'narrative_report_template_id');
    }

}
