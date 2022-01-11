<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Icd10CodeRequest;
use App\Services\Icd10CodeLocalClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Icd10CodeController extends Controller
{
    /**
     * Lookup up an ICD-10 code.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function lookup(Icd10CodeRequest $request, Icd10CodeLocalClient $localClient)
    {
        $data = $request->validated();
        // uses an external api
        // $codes = $apiClient->lookup($data['term']);
        // uses local db
        $codes = $localClient->lookup($data['term']);

        return response()->json($codes);
    }
}
