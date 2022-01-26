<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string  $hcpcs
 * @property integer $request_item_id
 * @property integer $request_type_id
 * @property boolean $is_default
 * @property boolean $is_recommended
 * @property string  $summary
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
        'is_recommended',
        'summary',
    ];

    protected $casts = [
        'is_default'      => 'boolean',
        'is_recommended'  => 'boolean',
        'request_type_id' => 'integer',
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
