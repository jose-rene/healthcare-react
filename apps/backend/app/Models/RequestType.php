<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestType extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    protected $fillable = [
        'name',
    ];

    public function typeDetails()
    {
        return $this->hasMany(RequestTypeDetail::class, 'request_type_id');
    }
}
