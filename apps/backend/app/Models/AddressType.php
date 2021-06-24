<?php

namespace App\Models;

use App\Traits\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AddressType extends Model
{
    use HasFactory, SoftDeletes, Sluggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Relationship to addresses.
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
}
