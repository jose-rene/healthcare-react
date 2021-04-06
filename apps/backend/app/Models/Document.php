<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
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
 * @property boolean fieExists
 */
class Document extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    protected $fillable = [
        'request_item_id',
        'parent_id',
        'document_type_id',
        'name',
        'mime_type',
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
        return Storage::disk(config('filesystems.defaultDocument'))->putFileAs('', $fileContents, $this->uuid);
    }

    public function getUrlAttribute()
    {
        return route('document.request', [
            'document' => $this->uuid,
            'name'     => $this->name,
        ]);
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
