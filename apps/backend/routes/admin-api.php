<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('member/duplicates', 'MembersController@duplicates')->name('member.duplicates');

Route::apiResource('payer', 'PayerController');
Route::apiResource('members', 'MembersController');
Route::apiResource('users', 'UserController');
