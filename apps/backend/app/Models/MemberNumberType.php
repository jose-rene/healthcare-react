<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MemberNumberType extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Relationship to payers.
     *
     * @return App\Models\Payer
     */
    public function payers()
    {
        return $this->belongsToMany(Payer::class);
    }
}
