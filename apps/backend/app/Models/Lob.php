<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lob extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * Relationship to payers.
     *
     * @return App\Models\Payer
     */
    public function lobs()
    {
        return $this->belongsToMany(Payer::class)->using(PayerLob::class);
    }
}
