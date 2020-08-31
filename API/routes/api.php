<?php

use App\Models\User;
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
Route::middleware('auth:api')->group(function ($router) {
    $router->get('/user', 'UserController@profile');
    $router->get('logout', 'LoginController@logout');
    // protected crud routes
    Route::apiResource('questionnaire', 'QuestionnaireController');
});

Route::post('/login', 'LoginController@login');
// @note uncomment to make registration routes publically available
/*Route::post('/register', 'LoginController@login');
Route::post('/register/create', 'RegisterController@store');*/

// add OPTIONS route to fire cors middleware for preflight
Route::options('/{any}', function () {
    return response()->json(['message' => true]);
})->where('any', '.*');

Route::options('/', function () {
    return response()->json(['message' => true]);
});
