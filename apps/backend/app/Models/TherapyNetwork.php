<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TherapyNetwork extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name'];

    public function getCategoryAttribute()
    {
        return 'Therapy Network';
    }

    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable');
    }

    public function emails()
    {
        return $this->morphMany(Email::class, 'emailable');
    }
}
