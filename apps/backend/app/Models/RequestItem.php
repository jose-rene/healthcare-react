<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestItem extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    protected $fillable = [
        'vendor_price',
        'request_id',
        'request_type_id',
        'request_outcome_id',
        'hcpcs_id',
        'note',
        'clinician_summary',
        'assessment',
        'decision',
        'json_data',
        // 'new_request_json',
        'is_additional_consideration',
        'name',
    ];

    protected $casts = [
        // 'new_request_json' => 'json',
        'json_data'    => 'json',
        'vendor_price' => 'double',
    ];

    public function requestType()
    {
        return $this->belongsTo(RequestType::class);
    }

    public function requestTypeDetails()
    {
        return $this->belongsToMany(RequestTypeDetail::class, 'request_item_details');
    }

    public function considerations()
    {
        return $this->hasMany(Consideration::class);
    }

    public function outcome()
    {
        return $this->belongsTo(RequestOutcome::class);
    }

    public function hcpcs()
    {
        return $this->belongsTo(Hcpc::class, 'hcpcs_id');
    }

    public function itemDetails()
    {
        return $this->belongsTo(RequestItemDetail::class, 'request_item_id');
    }

    public function getDefaultConsiderationsAttribute()
    {
        if (!$this->considerations()->count()) {
            // add the default consideration based upon this request item
            $consideration = $this->considerations()->create([
                'request_item_id' => $this->id,
                'request_type_id' => $this->request_type_id,
                'is_default'      => true,
            ]);
        }
        
        return $this->considerations;
    }

    /*
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
