<?php

use App\Http\Resources\MyUserResource;
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
    Route::apiResource('assessment', 'AssessmentController');
    // test fmapi route
    Route::get('/fmtest', 'HomeController@fmtest');

    /**
     * This section of code is using the bouncer permissions.
     */
    Route::group(['middleware' => 'can:superAdmin'], function($router){
        $router->get('something/for/super-admins', function(){
            return new MyUserResource(auth()->user());
        });
    });
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
