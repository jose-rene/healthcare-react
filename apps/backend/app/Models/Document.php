<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'request_item_id',
        'parent_id',
        'document_type_id',
        'url',
        'name',
        'mime_type',
    ];

    public function documentable()
    {
        return $this->morphTo();
    }

    public function type()
    {
        return $this->hasOne(DocumentType::class, 'document_type_id');
    }
}
