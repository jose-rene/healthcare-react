<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'          => $this->uuid,
            //            'assessments' => new AssessmentResourceCollection($this->assessments),
            'member'      => new MemberResource($this->member),
        ];
    }
}
