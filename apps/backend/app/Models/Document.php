<?php

namespace App\Models;

use App\Events\DocumentCreated;
use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Tags\HasTags;
use Storage;

/**
 * @property int     id
 * @property int     parent_id
 * @property int     document_type_id
 * @property string  uuid
 * @property string  url
 * @property string  name
 * @property string  mime_type
 * @property mixed   file
 * @property string  fileName
 * @property boolean fileExists
 */
class Document extends Model
{
    use HasFactory, HasTags, SoftDeletes, Uuidable;

    protected $fillable = [
        'request_item_id',
        'parent_id',
        'document_type_id',
        'name',
        'mime_type',
        'request_id',
        'object_name',
        'position',
        'description',
        'exif_data',
    ];

    protected $casts = [
        'position'         => 'integer',
        'document_type_id' => 'integer',
    ];

    protected $dispatchesEvents = [
        'created' => DocumentCreated::class,
    ];

    protected $appends = ['url'];

    public function getFileNameAttribute()
    {
        return $this->uuid;
    }

    public function getFileExistsAttribute()
    {
        return Storage::disk(config('filesystems.defaultDocument'))->exists($this->fileName);
    }

    public function getFileAttribute()
    {
        return Storage::disk(config('filesystems.defaultDocument'))->get($this->fileName);
    }

    public function setFileAttribute($fileContents)
    {
        return Storage::disk(config('filesystems.defaultDocument'))->putFileAs('', $fileContents, $this->fileName);
    }

    public function getUrlAttribute()
    {
        return route('document.request', [
            'document' => $this->fileName,
            'name'     => $this->name,
        ]);
    }

    public function getThumbnailNameAttribute()
    {
        return $this->uuid . '-tn';
    }

    public function getThumbnailExistsAttribute()
    {
        return Storage::disk(config('filesystems.defaultDocument'))->exists($this->thumbnailName);
    }

    public function getThumbnailAttribute()
    {
        return Storage::disk(config('filesystems.defaultDocument'))->get($this->thumbnailName);
    }

    public function setThumbnailAttribute($fileContents)
    {
        return Storage::disk(config('filesystems.defaultDocument'))->putFileAs('', $fileContents, $this->thumbnailName);
    }

    public function getThumbnailUrlAttribute()
    {
        return  $this->thumbnail_exists ? route('document.request', [
            'document' => $this->thumbnailName,
            'name'     => $this->name,
        ]) : null;
    }

    public function documentable()
    {
        return $this->morphTo();
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class, 'document_type');
    }

    public function requestItem()
    {
        return $this->belongsTo(RequestItem::class);
    }

    public function request()
    {
        return $this->belongsTo(Request::class);
    }

    public function getIsMediaAttribute()
    {
        return $this->document_type_id === 2;
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
