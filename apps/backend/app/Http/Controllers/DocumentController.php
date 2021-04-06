<?php

namespace App\Http\Controllers;

use App\Models\Document;

class DocumentController extends Controller
{
    public function show(Document $document, $name)
    {
        abort_if(!$document->fileExists, 404, 'file "' . $name . '" not found');

        return response()
            ->make($document->file)
            ->header('Content-Type', $document->mime_type ?? 'png')
            ->setCache(['no_cache' => true]);
    }
}
