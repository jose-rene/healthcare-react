<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentRequest;
use App\Http\Requests\FileRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = Document::pagination($request->get('perPage', 50));

        return response()->json(compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param FileRequest $request
     * @return DocumentResource
     */
    public function store(FileRequest $request)
    {
        // Update database
        $document = Document::create($request->validated());

        // store file
        $document->file = $request->file('file');

        return new DocumentResource($document);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param FileRequest $request
     * @param Document    $document
     * @return DocumentResource
     */
    public function update(FileRequest $request, Document $document)
    {
        // create new database entry
        $newDocument = Document::create($request->validated() + ['parent_id' => $document->id]);

        // store file
        $document->file = $request->file('file');

        return new DocumentResource($newDocument);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Document $document
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Document $document)
    {
        $document->delete();

        return response()->json(['message' => 'ok']);
    }
}
