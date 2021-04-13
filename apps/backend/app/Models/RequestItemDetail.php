<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestItemDetail extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    protected $fillable = [
        'request_item_id',
        'request_type_id',
        'request_outcome_id',
        'hcpcs',
        'note',
        'name',
    ];

    public function outcome()
    {
        return $this->hasMany(RequestOutcome::class, 'outcome_id')
            ->orderBy('id', 'desc'); // newest outcome first
    }
}
