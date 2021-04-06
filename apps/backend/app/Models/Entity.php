<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entity extends Model
{
    use HasFactory;

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
}
