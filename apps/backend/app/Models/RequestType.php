<?php

namespace App\Models;

use App\Traits\Uuidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestType extends Model
{
    use HasFactory, SoftDeletes, Uuidable;

    protected $guarded = ['id'];

    /**
     * Relationship to request type details.
     *
     * @return Illuminate\Database\Eloquent\Collection of RequestTypeDetail
     */
    public function requestTypeDetails()
    {
        return $this->hasMany(RequestTypeDetail::class)->orderBy('name');
    }

    /**
     * Relationship to Classifications.
     *
     * @return Classification
     */
    public function classification()
    {
        return $this->belongsTo(Classification::class);
    }

    /**
     * Will return one level of children or child sections.
     *
     * @return Illuminate\Database\Eloquent\Collection of RequestType
     */
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('name');
    }

    /**
     * Will implement the recursive relationship and return the hiarchy of child sections.
     *
     * @return Illuminate\Database\Eloquent\Collection of RequestType
     */
    public function childRequestTypes()
    {
        return $this->hasMany(self::class, 'parent_id')->with('children');
    }

    /**
     * Will return one level of children or child sections.
     *
     * @return RequestType
     */
    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Will return one level of children or child sections.
     *
     * @return RequestType
     */
    public function ancestors()
    {
        return $this->belongsTo(self::class, 'parent_id')->with('parent');
    }

    public function hcpcs()
    {
        return $this->belongsTo(Hcpc::class, 'hcpcs_id');
    }

    public function requestTypeDetailTemplate()
    {
        return $this->belongsTo(RequestTypeDetailTemplate::class, 'request_type_template_id');
    }
}
