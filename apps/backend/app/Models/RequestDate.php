<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestDate extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'request_date_type_id',
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
