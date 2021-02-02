<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Phone extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    public function phoneable()
    {
        return $this->morphTo();
    }
}
