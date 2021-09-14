<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 *
 * @property int   $id
 * @property array $form_data
 * @property Form  $form
 */
class FormAnswer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'form_id',
        'user_id',
        'form_data',
        'completed_at',
    ];

    protected $casts = [
        'form_data' => 'json',
    ];

    protected $dates = ['completed_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function form()
    {
        return $this->belongsTo(Form::class);
    }

    public function scopeUserAnswers($query, $user_id = null)
    {
        if (!$user_id) {
            $user_id = auth()->id();
        }

        return $query->where(compact('user_id'))->orderBy('updated_at', 'desc');
    }
}
