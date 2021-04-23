<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\Request;
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

        return new DocumentResource($document);
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
}
