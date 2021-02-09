<?php

namespace App\Models\UserType;

use App\Model\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EngineeringUser extends Model
{
    use HasFactory;

    /**
     * Relationship to users.
     *
     * @return App\Model\User
     */
    public function listitems()
    {
        return $this->belongsTo(User::class);
    }
}
