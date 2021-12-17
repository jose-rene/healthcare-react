<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileRequest;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\MediaResource;
use App\Models\Document;
use App\Models\Request;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request as httpRequest;

class DocumentRequestController extends Controller
{
    public function index(Request $request)
    {
        return DocumentResource::collection($request->documents);
    }

    public function store(Request $request, FileRequest $httpRequest)
    {
        /** @var Document $document */
        $document = $request->documents()->create($httpRequest->validated());

        $document->file = $httpRequest->file('file');

        return $document->is_media ? new MediaResource($document) : new DocumentResource($document);
    }

    public function show(httpRequest $request, Document $document)
    {
        return new DocumentResource($document);
    }

    public function update(Request $request, FileRequest $httpRequest, Document $document)
    {
        /** @var Document $document */
        $document = $request->documents()->create($httpRequest->validated() + ['parent_id' => $document->id]);

        $document->file = $httpRequest->file('file');

        return new DocumentResource($document);
    }

    /**
     * Remove the specified document from storage.
     *
     * @param ModelRequest $request
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Request $request, Document $document)
    {
        if (null === ($deleteDocument = $request->documents()->find($document->id))) {
            throw new HttpResponseException(response()->json(['errors' => ['document' => [sprintf('Document not found: %s', $document->uuid)]]], 422));
        }
        $deleteDocument->delete();

        return response()->json(['message' => 'ok']);
    }
}
