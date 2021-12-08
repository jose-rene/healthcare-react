<?php

namespace App\Listeners;

use App\Events\DocumentCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\File;
use Illuminate\Queue\InteractsWithQueue;
use Intervention\Image\Exception\NotSupportedException;
use Image;
use Spatie\Tags\Tag;

class DocumentCreatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\DocumentCreated  $event
     * @return void
     */
    public function handle(DocumentCreated $event)
    {
        if (!$event->document->is_media) {
            return;
        }

        // check image and run any neccessary transformations
        try {
            $image = Image::make(request()->file('file'));
        } catch(\Exception $e) {
            // non supported media, don't trust client mime type
            $event->document->update([
                'mime_type' => request()->file('file')->getMimeType(),
            ]);

            return;
        }

        try {
            $exif = $image->exif();
        } catch (NotSupportedException $e) {
            $exif = null;
        }

        // create the thumbnail, use fit instead of resize
        $image->fit($size = env('THUMBNAIL_SIZE', 300), $size, function ($constraint) {
            // $constraint->aspectRatio(); // constrain aspect ratio (auto height), not needed for fit
            $constraint->upsize(); // prevent upsizing
        }, 'top')->save($path = request()->file('file')->path() . '-tn');
        // save to storage
        $event->document->thumbnail = $path;

        // update document
        $event->document->update([
            'mime_type' => $image->mime(),
            'exif'      => $exif,
        ]);

        // process tag if present
        if (null !== ($tag = request()->get('tag'))) {
            $mediaTag = Tag::findOrCreate($tag, 'mediaTag');
            $event->document->attachTag($mediaTag);
        }
    }
}
