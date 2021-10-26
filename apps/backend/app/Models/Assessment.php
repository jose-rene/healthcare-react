<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class Assessment extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = ['name', 'description'];

        /**
         * The relationship to form (form sections)
         * 
         * @return Illuminate\Support\Collection 
         */
        public function forms()
        {
            return $this->belongsToMany(Form::class, 'assessment_form')->withPivot('id', 'name', 'description', 'position')->orderBy('position');
        }

        /**
         * Get the route key for the model.
         *
         * @return string
         */
        public function getRouteKeyName()
        {
            return 'uuid';
        }
}
