<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Payer;
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

    public function payerAvatarShow(Payer $payer, $name = 'avatar')
    {
        $avatar = $payer->avatar;

        abort_if(!$avatar, 404, 'file "' . $name . '" not found');

        return response()
            ->make($avatar)
            ->header('Content-Type', config('app.avatar_image_type'))
            ->setCache(['no_cache' => false]);
    }

    public function profileImageShow(User $user)
    {
        $image = $user->avatar;

        return response()
            ->make($image)
            ->header('Content-Type', config('app.avatar_image_type'))
            ->setCache(['no_cache' => false]);
    }
}
