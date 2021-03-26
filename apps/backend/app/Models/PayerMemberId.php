<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayerMemberId extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'payer_id',
        'name',
        'title',
    ];

    public function payer()
    {
        return $this->belongsTo(Payer::class);
    }
}
