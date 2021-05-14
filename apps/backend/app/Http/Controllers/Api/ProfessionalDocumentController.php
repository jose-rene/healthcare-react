<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileRequest;
use App\Http\Resources\ProfessionalDocumentResource;
use App\Models\ProfessionalDocument;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfessionalDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = ProfessionalDocument::pagination($request->get('perPage', 50));

        return response()->json(compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param FileRequest $request
     * @return ProfessionalDocumentResource
     */
    public function store(FileRequest $request)
    {
        // Update database
        $professionalDocument = ProfessionalDocument::create($request->validated());

        // store file
        $professionalDocument->file = $request->file('file');

        return new ProfessionalDocumentResource($professionalDocument);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param FileRequest          $request
     * @param ProfessionalDocument $professionalDocument
     * @return ProfessionalDocumentResource
     */
    public function update(FileRequest $request, ProfessionalDocument $professionalDocument)
    {
        // create new database entry
        $newProfessionalDocument = ProfessionalDocument::create($request->validated() + ['parent_id' => $professionalDocument->id]);

        // store file
        $professionalDocument->file = $request->file('file');

        return new ProfessionalDocumentResource($newProfessionalDocument);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ProfessionalDocument $professionalDocument
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(ProfessionalDocument $professionalDocument)
    {
        $professionalDocument->delete();

        return response()->json(['message' => 'ok']);
    }
}
