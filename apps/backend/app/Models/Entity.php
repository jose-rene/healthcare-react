<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Entity extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'eag';

    protected $fillable = [
        'entity',
        'column_name',
        'data_type',
        'key',
        'nullable',
        'comments',
        'cache_json',
    ];

    protected $casts = [
        'cache_json' => 'json',
    ];

    public function getUniqueIdentifierAttribute()
    {
        $entity      = $this->entity;
        $column_name = $this->column_name;

        return json_encode(compact('entity', 'column_name'));
    }
}
