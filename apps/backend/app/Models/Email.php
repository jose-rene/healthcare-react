<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Email extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'email',
        'email_type_id',
        'is_primary',
        'contact_type',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function type()
    {
        return $this->hasOne(EmailType::class, 'email_type_id');
    }

    public function emailable()
    {
        return $this->morphTo();
    }
}
