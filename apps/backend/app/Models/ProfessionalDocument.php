<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 *
 **/
class ProfessionalDocument extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date_exp',
        'document_number',
        'issuing_authority',
        'object_name',
        'state',
        'clinical_user_id',
        'license_type_id',
        'professional_document_type_id',
    ];

    protected $dates = ['date_exp'];


    public function getFileNameAttribute()
    {
        return $this->uuid;
    }

    public function getFileExistsAttribute()
    {
        return Storage::disk(config('filesystems.defaultProfessionalDocument'))->exists($this->fileName);
    }

    public function getFileAttribute()
    {
        return Storage::disk(config('filesystems.defaultProfessionalDocument'))->get($this->fileName);
    }

    public function setFileAttribute($fileContents)
    {
        return Storage::disk(config('filesystems.defaultProfessionalDocument'))->putFileAs('', $fileContents,
            $this->uuid);
    }

    public function getUrlAttribute()
    {
        return route('document.request', [
            'document' => $this->uuid,
            'name'     => $this->name,
        ]);
    }

    public function licenseType()
    {
        return $this->hasOne(LicenseType::class, 'license_type_id');
    }

    public function documentType()
    {
        return $this->hasOne(ProfessionalDocumentType::class, 'professional_document_type_id');
    }

    public function clinicalUser()
    {
        return $this->hasOne(ClinicalUser::class, 'clinical_user_id');
    }
}
