<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class Consideration extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'hcpcs',
        'request_item_id',
        'request_type_id',
        'is_default',
        'summary',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function requestItem()
    {
        return $this->belongsTo(RequestItem::class, 'request_item_id');
    }

    public function requestType()
    {
        return $this->belongsTo(RequestType::class, 'request_type_id');
    }
}
