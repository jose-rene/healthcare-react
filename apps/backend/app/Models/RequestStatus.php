<?php

namespace App\Models;

use App\Traits\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 * @method static slug(string $string)
 */
class RequestStatus extends Model
{
    use HasFactory, SoftDeletes, Sluggable;

    protected $fillable = [
        'name',
        'slug',
        'sort',
    ];

    public function scopeSlug($query, $slug)
    {
        return $query->where('slug', 'like', $slug);
    }
}
