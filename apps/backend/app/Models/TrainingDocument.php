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
 * @property string fileName
 */
class TrainingDocument extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'training_document_id',
        'payer_id',
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
        return $this->hasOne(DocumentType::class, 'document_type');
    }

    public function payer()
    {
        return $this->belongsTo(Payer::class, 'payer_id');
    }

    public function scopeTypeId($query, $type_id = null)
    {
        if ($type_id) {
            $query->where('training_document_type_id', $type_id);
        }
    }

    public function scopeIsGlobal($query)
    {
        return $query->whereNull('payer_id');
    }
}
