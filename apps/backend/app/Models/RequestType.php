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
     * Will return one level of children or child types.
     *
     * @return Illuminate\Database\Eloquent\Collection of RequestType
     */
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('name');
    }

    /**
     * Will implement the recursive relationship and return the hiarchy of child types.
     *
     * @return Illuminate\Database\Eloquent\Collection of RequestType
     */
    public function childRequestTypes()
    {
        return $this->hasMany(self::class, 'parent_id')->with('children');
    }

    /**
     * Will return one level of parent.
     *
     * @return RequestType
     */
    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Will implement the recursive relationship and return the hiarchy of parent types.
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

    public function getAllParentsAttribute()
    {
        // the parent request types
        return $this->ancestors ? array_reverse(self::mapParents($this->ancestors, true)) : null;
        // the related classifcation, will be related to the top parent
        $classification = null;
        if (!empty($parents) && null !== ($requestType = RequestType::find($parents[0])) && $requestType->classification) {
            $classification = $requestType->classification;
        }
    }

    public function getTopClassificationAttribute()
    {
        // the related classifcation, will be related to the top parent
        $classification = null;
        if (null !== $this->allParents && null !== ($requestType = self::find($this->allParents[0])) && $requestType->classification) {
            $classification = $requestType->classification;
        }

        return $classification;
    }

    /**
     * Recursively creates an array of parent ids.
     *
     * @param mixed $requestType
     * @return array
     */
    protected static function mapParents($requestType, $reset = false)
    {
        static $parents = [];
        if (true === $reset) {
            $parents = [];
        }
        if (!$requestType) {
            return $parents;
        }
        $parents[] = $requestType['id'];
        if ($requestType['parent']) {
            return self::mapParents($requestType['parent']);
        }

        return $parents;
    }
}
