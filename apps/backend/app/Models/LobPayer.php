<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class LobPayer extends Pivot
{
    protected $primaryKey = 'id';
    public $incrementing = true;
}
