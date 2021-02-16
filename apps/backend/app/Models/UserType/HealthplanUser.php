<?php

namespace App\Models\UserType;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthplanUser extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Relationship to user.
     *
     * @return App\Models\User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
