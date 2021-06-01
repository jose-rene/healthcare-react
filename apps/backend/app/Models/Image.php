<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Storage;

/**
 *
 *
 * @property boolean fileExists
 * @property mixed   file
 */
class Image extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'imageable',
        'parent_id',
        'name',
        'mime_type',
        'object_name',
    ];

    protected $appends = ['url'];

    public function imageable()
    {
        return $this->morphTo();
    }


    public function getFileNameAttribute()
    {
        return $this->uuid;
    }

    public function getFileExistsAttribute()
    {
        return Storage::disk(config('filesystems.defaultImageImage'))->exists($this->fileName);
    }

    public function getFileAttribute()
    {
        return Storage::disk(config('filesystems.defaultImageImage'))->get($this->fileName);
    }

    public function setFileAttribute($fileContents)
    {
        return Storage::disk(config('filesystems.defaultImageImage'))->putFileAs('', $fileContents, $this->uuid);
    }

    public function getUrlAttribute()
    {
        return route('image.show', [
            'image' => $this->uuid,
            'name'  => $this->name,
        ]);
    }

    /*
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
