<?php

use App\Models\Phone;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->describe('Display an inspiring quote');

Artisan::command('test', function () {
    // Generates a collection of App\Model\Phone that does not get saved in the database.
    $phones = factory(Phone::class, random_int(5, 10))->make();

    // die and dump an array of generated phones
    dd($phones->toArray());
});
