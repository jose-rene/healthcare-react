<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Consultant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'request_id',
        'clinician_id',
        'clinical_user_id',
    ];
}
