<?php

namespace App\Traits;

trait Observable
{
    public static function bootObservable()
    {
        static::created(function ($instance) {
            $instance->onCreated();
        });
    }

    abstract public function onCreated();
}
