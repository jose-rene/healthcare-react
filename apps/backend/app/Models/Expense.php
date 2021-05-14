<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class Expense extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'amount',
        'description',
        'expenseable',
        'expense_type_id',
        'request_id',
    ];

    protected $casts = [
        'amount' => 'double',
    ];

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }

    public function type()
    {
        return $this->belongsTo(ExpenseType::class, 'expense_type_id');
    }

    public function expenseable()
    {
        return $this->morphTo();
    }
}
