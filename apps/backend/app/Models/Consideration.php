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
    ];

    public function item()
    {
        return $this->hasOne(RequestItem::class, 'request_item_id');
    }

    public function type()
    {
        return $this->hasOne(RequestType::class, 'request_type_id');
    }
}
