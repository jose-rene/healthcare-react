<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MemberPayerHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lob_id',
        'member_id',
        'member_number',
        'member_number_type',
        'payer_id',
    ];
}
