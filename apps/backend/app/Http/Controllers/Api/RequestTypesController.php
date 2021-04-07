<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequestItemResource;
use App\Models\RequestType;

class RequestTypesController extends Controller
{
    public function index()
    {
        $items = RequestType::all();

        return RequestItemResource::collection($items);
    }
}
