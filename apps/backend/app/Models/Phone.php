<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Phone extends Model
{
    use SoftDeletes, HasFactory, Uuidable;

    protected $guarded = ['id'];

    public function phoneable()
    {
        return $this->morphTo();
    }
}
