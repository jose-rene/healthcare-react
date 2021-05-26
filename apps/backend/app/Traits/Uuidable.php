<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait Uuidable
{
    protected static function bootUuidable()
    {
        static::creating(function ($model) {
            $model->setAttribute('uuid', (string) Str::uuid());
        });
    }
}
