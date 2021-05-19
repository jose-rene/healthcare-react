<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\User;

class ImageController extends Controller
{
    public function show(Image $image, $name)
    {
        abort_if(!$image->fileExists, 404, 'file "' . $name . '" not found');

        return response()
            ->make($image->file)
            ->header('Content-Type', $document->mime_type ?? 'png')
            ->setCache(['no_cache' => false]);
    }

    public function profileImageShow(User $user)
    {
        $image = $user->avatar;
        return response()
            ->make($image)
            ->header('Content-Type', 'png')
            ->setCache(['no_cache' => false]);
    }
}
