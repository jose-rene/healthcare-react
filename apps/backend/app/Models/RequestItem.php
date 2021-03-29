<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'request_id',
        'request_type_id',
        'request_outcome_id',
        'hcpcs',
        'note',
        'clinician_summary',
        'assessment',
        'decision',
        'json_data',
        'new_request_json',
        'additional_consideration',
    ];

    protected $casts = [
        'new_request_json' => 'json',
        'json_data'        => 'json',
    ];

    public function outcome()
    {
        return $this->belongsTo(RequestOutcome::class);
    }

    public function itemDetail()
    {
        return $this->hasOne(RequestItemDetail::class, 'request_item_id');
    }
}
