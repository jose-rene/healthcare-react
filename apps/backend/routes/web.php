<?php

use Illuminate\Support\Facades\Route;
use Aacotroneo\Saml2\Saml2Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// handle sso login domain
Route::domain(env('DME_SSO_DOMAIN'))->group(function () {
    Route::get('/', function () {
        $saml2Auth = new Saml2Auth(Saml2Auth::loadOneLoginAuthFromIpdConfig('dme'));
        // redirect to external auth provider to initiate saml login process
        return $saml2Auth->login(URL::full());
    });
});
Route::get('/', 'HomeController@welcome');

Auth::routes(['register' => false]);

Route::get('/home', 'HomeController@index')->name('home');
