<?php

namespace App\Models;

use Arr;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property bool     is_primary
 * @property string      address_1
 * @property string      address_2
 * @property string      city
 * @property string      county
 * @property string      state
 * @property string      postal_code
 * @property int     address_type_id
 * @property AddressType addressType
 */
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
        'address_type_id',
    ];

    protected $casts = ['is_primary' => 'boolean'];

    /**
     * Polymorphic relationship.
     */
    public function addressable()
    {
        return $this->morphTo();
    }

    public function getTypeNameAttribute()
    {
        return Arr::get($this->addressType, 'name', '');
    }

    public function addressType()
    {
        return $this->belongsTo(AddressType::class)->withDefault([
            'id'   => 0,
            'name' => 'N/A',
        ]);
    }
}
