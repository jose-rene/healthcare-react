<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestTypeDetail extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'request_type_id',
        'name',
        'is_default',
        'request_type_detail_template_id',
    ];

    protected $casts = ['is_default' => 'boolean'];

    public function requestType()
    {
        return $this->belongsTo(RequestType::class);
    }

    public function requestItems()
    {
        return $this->belongsToMany(RequestItem::class, 'request_item_details');
    }

    public function requestTypeDetailTemplate()
    {
        return $this->belongsToMany(RequestTypeDetailTemplate::class, 'request_type_detail_template_id');
    }
}
