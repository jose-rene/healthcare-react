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
Route::get('company/categories', 'CompanyController@categories')->name('company.categories');
Route::post('company', 'CompanyController@store')->name('company.create');
Route::post('payer/{payer}/contact', 'PayerController@contact')->name('payer.contact.create');
Route::put('payer/{payer}/email/{id}', 'PayerController@updateEmail')->name('payer.email.update');
Route::put('payer/{payer}/phone/{id}', 'PayerController@updatePhone')->name('payer.phone.update');
Route::delete('payer/{payer}/email/{id}', 'PayerController@destroyEmail')->name('payer.email.delete');
Route::delete('payer/{payer}/phone/{id}', 'PayerController@destroyPhone')->name('payer.phone.delete');

Route::apiResource('payer', 'PayerController');
Route::apiResource('member', 'MemberController');
Route::apiResource('users', 'UserController');
