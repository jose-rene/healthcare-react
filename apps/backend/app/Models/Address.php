<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'is_primary',
        'address_1',
        'address_2',
        'city',
        'county',
        'state',
        'postal_code',
    ];

    /**
     * Polymorphic relationship.
     */
    public function addressable()
    {
        return $this->morphTo();
    }
}
