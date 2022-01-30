<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string  $uuid
 * @property number  $number
 * @property boolean $is_primary
 * @property boolean $is_mobile
 * @property string  $contact_type
 */
class Phone extends Model
{
    use SoftDeletes, HasFactory, Uuidable;

    protected $fillable = [
        'number',
        'is_primary',
        'is_mobile',
        'contact_type',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_mobile'  => 'boolean',
    ];

    public function phoneable()
    {
        return $this->morphTo();
    }
}
