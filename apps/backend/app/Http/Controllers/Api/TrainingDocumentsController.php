<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrainingDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\TrainingDocument;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainingDocumentsController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = auth()
            ->user()
            ->payer
            ->trainingDocuments
            ->filter(fn($d) => $d->training_document_type_id == $request->get('training_document_type_id'));

        return DocumentResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TrainingDocumentRequest $request
     * @return JsonResponse
     */
    public function store(TrainingDocumentRequest $request)
    {
        $trainingDocument = TrainingDocument::create($request->validated());

        return new DocumentResource($trainingDocument);
    }

    /**
     * Display the specified resource.
     *
     * @param TrainingDocument $trainingDocument
     * @return JsonResponse
     */
    public function show(TrainingDocument $trainingDocument)
    {
        return new DocumentResource($trainingDocument);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TrainingDocumentRequest $request
     * @param TrainingDocument        $trainingDocument
     * @return JsonResponse
     */
    public function update(TrainingDocumentRequest $request, TrainingDocument $trainingDocument)
    {
        $trainingDocument->update($request->validated());

        return response()->json(['message' => 'ok']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param TrainingDocument $trainingDocument
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(TrainingDocument $trainingDocument)
    {
        $trainingDocument->delete();

        return response()->json(['message' => 'ok']);
    }
}
