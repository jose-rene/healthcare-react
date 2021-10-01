<?php

namespace App\Models\UserType;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class BusinessOperationsUser extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'business_users';

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = [
            //TODO :: add columns here
        ];
}
