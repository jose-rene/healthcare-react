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

Route::get('member/duplicates', 'MemberController@duplicates')->name('member.duplicates');
Route::get('company/categories', 'CompanyCategoryController@index')->name('company.categories');

Route::apiResource('payer', 'PayerController');
Route::apiResource('member', 'MemberController');
Route::apiResource('users', 'UserController');
