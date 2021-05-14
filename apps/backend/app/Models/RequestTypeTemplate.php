<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class RequestTypeTemplate extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'parent_id',
        'hcpcs_id',
        'is_inherit_children',
        'is_requestable',
    ];

    protected $casts = [
        'is_inherit_children' => 'boolean',
        'is_requestable'      => 'boolean',
    ];

    public function hcpcs()
    {
        return $this->hasOne(Hcpc::class, 'hcpcs_id');
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}
