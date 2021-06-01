<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class RequestTypeDetailTemplate extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'is_inherit_children',
        'is_requestable',
        'hcpcs_id',
        'parent_id',
        'request_type_template_id',
        'is_auto_include',
        'is_auto_include',
    ];

    protected $casts = [
        'is_inherit_children' => 'boolean',
        'is_requestable'      => 'boolean',
        'is_auto_include'     => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function child()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function hcpcs()
    {
        return $this->belongsTo(Hcpc::class, 'hcpcs_id');
    }

    public function requestTypeTemplate()
    {
        return $this->belongsTo(RequestTypeTemplate::class, 'request_type_template_id');
    }
}
