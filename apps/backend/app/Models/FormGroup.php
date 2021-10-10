<?php

namespace App\Models;

use App\Traits\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class FormGroup extends Model
{
    use HasFactory, SoftDeletes, Sluggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'slug',
        'name',
    ];

    public function formsSlugSync($slugs)
    {
        $ids = Form::whereIn('slug', $slugs)->pluck('id')->toArray();

        $this->forms()->detach();
        $this->forms()->attach($ids);
    }

    public function forms()
    {
        return $this->belongsToMany(
            Form::class,
            'form_form_group',
            'form_group_id',
            'form_id',
        );
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
