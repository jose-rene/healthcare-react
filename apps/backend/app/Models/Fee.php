<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'request_id',
        'fee_type_id',
        'fee',
        'date',
        'description',
    ];

    public function request()
    {
        return $this->belongsTo(FeeType::class, 'request_id');
    }

    public function type()
    {
        return $this->belongsTo(FeeType::class, 'fee_type_id');
    }
}
