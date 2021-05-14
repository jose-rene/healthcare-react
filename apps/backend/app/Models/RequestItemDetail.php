<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestItemDetail extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    protected $fillable = [
        'request_item_id',
        'request_type_id',
        'request_outcome_id',
        'hcpcs',
        'note',
        'name',
        'is_default',
        'request_type_detail_template_id',
        'request_type_id',
    ];

    protected $casts = ['is_default' => 'boolean'];

    public function outcome()
    {
        return $this->hasMany(RequestOutcome::class, 'outcome_id')
            ->orderBy('id', 'desc'); // newest outcome first
    }

    public function template()
    {
        return $this->belongsTo(NarrativeReportTemplate::class, 'narrative_report_template_id');
    }

    public function type()
    {
        return $this->belongsTo(RequestType::class, 'request_type_id');
    }
}
