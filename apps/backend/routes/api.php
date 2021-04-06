<?php

use App\Http\Controllers\Api\LoginController;
use App\Http\Resources\MyUserResource;
use App\Models\Member;
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

// single sign on token route
Route::get('/ssologin/{email}', [LoginController::class, 'requestToken'])->name('ssologin');

Route::middleware('auth:api')->group(function ($router) {
    $router->get('/payer/profile', 'PayerController@profile')->name('company.profile');
    // @todo deprecate these test routes, will be supersceded by payer and lobs
    $router->get('/plan/plans', 'PlanController@plans');
    $router->get('/plan/lobs', 'PlanController@lobs');
    $router->get('/plan/idtypes', 'PlanController@idtypes');
    // user routes
    $router->get('/user/profile', 'UserController@profile');
    $router->put('/user/profile', 'UserController@profileSave');

    Route::put('/user/password', 'PasswordController@authedChangePassword');

    $router->post('/member/search', 'MemberController@search')->middleware('can:viewAny,' . Member::class);
    $router->post('/user/search', 'UserController@search');
    $router->get('/user/available_roles', 'UserController@availableRoles');
    $router->get('logout', 'LoginController@logout');
    $router->get('notifications', 'NotificationsController@index');
    $router->put('notifications', 'NotificationsController@update');
    // request info
    $router->get('/request/summary', 'RequestController@summary');
    $router->get('/request/inspire', 'RequestController@inspire');
    $router->get('/request/list', 'RequestController@inspire');
    // protected crud routes
    Route::apiResource('questionnaire', 'QuestionnaireController');
    Route::apiResource('assessment', 'AssessmentController');
    Route::apiResource('request', 'RequestController');
    Route::apiResource('member', 'MemberController');
    Route::apiResource('payer', 'PayerController');
    Route::apiResource('member.member-requests', 'MemberRequestController')->only('store', 'show', 'update');
    Route::apiResource('member-request.request-item', 'RequestRequestItemController')->only('store', 'show', 'update');
    Route::apiResource('activity', 'ActivityController');
    Route::apiResource('user', 'UserController');
    Route::apiResource('document', 'DocumentController')->only('store', 'update', 'destroy');
    // test fmapi route
    Route::get('/fmtest', 'HomeController@fmtest');

    /*
     * This section of code is using the bouncer permissions.
     */
    Route::group(['middleware' => 'can:superAdmin'], function ($router) {
        $router->get('something/for/super-admins', function () {
            return new MyUserResource(auth()->user());
        });
    });
});

Route::post('/login', 'LoginController@login');
Route::get('password/history/check', 'PasswordController@check');
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
