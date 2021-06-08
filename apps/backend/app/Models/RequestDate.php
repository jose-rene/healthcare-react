<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestDate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'request_id',
        'request_date_type_id',
        'note',
        'date',
    ];

    public function getTypeNameAttribute()
    {
        return $this->type->name ?? '';
    }

    public function type()
    {
        return $this->belongsTo(RequestDateType::class);
    }
}
