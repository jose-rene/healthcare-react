<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classification extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Relationship to RequestType.
     *
     * @return Illuminate\Database\Eloquent\Collection of RequestType
     */
    public function requestTypes()
    {
        return $this->hasMany(RequestType::class)->orderBy('name');
    }
}
