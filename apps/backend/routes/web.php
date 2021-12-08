<?php

use Aacotroneo\Saml2\Saml2Auth;
use App\Http\Controllers\Api\RequestFormSectionController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ImageController;
use App\Models\Form;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Route;

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

Route::get('testing', function(){
    $request = \App\Models\Request::find(2);
    $form = Form::find(5);
    return (new RequestFormSectionController())->show($request, $form);
});

// handle sso login triggering subdomain
Route::domain(env('DME_SSO_DOMAIN'))->group(function (Router $router) {
    $router->get('/', function () {
        $saml2Auth = new Saml2Auth(Saml2Auth::loadOneLoginAuthFromIpdConfig('dme'));
        // redirect to external auth provider to initiate saml login process
        return $saml2Auth->login(env(
            'FRONTEND_SSO_URL',
            '/'
        )); // URL::full() is original url, but will make infinite loop if it is also the sso triggering url
    })->where('any', '^(?!saml2).*');
});

Route::middleware(['api'])->group(function ($router) {
    $router->get('document/{document}/name/{name}', [DocumentController::class, 'show'])->name('document.request');
});

Route::middleware(['api'])->group(function ($router) {
    $router->get('document/{document}/tn/{tn}', [DocumentController::class, 'thumbnail'])->name('document.thumbnail');
});

Route::get('/image/{image}/request/{name}', [ImageController::class, 'show'])->name('image.show');
Route::get('/image/{user}/profile/{user_name}',
    [ImageController::class, 'profileImageShow'])->name('profile.image.show');
Route::get('/image/{payer}/avatar.png', [ImageController::class, 'payerAvatarShow'])->name('payer.avatar.show');

Route::middleware('auth:api')->group(function ($router) {
    $router->get('/image/me', function (Request $request) {
        return (new ImageController)->profileImageShow($request->user());
    })->name('images.me');
});

Route::get('/', 'HomeController@welcome');

Auth::routes(['register' => false]);

Route::get('/home', 'HomeController@index')->name('home');

Route::get('login/{provider}', [LoginController::class, 'redirectToProvider']);
Route::get('login/{provider}/callback', [LoginController::class, 'handleProviderCallback']);

//Route::get('test/my/user/{token}', function ($token) {
//    $oath_service = OathClients::where('service_token', $token)->firstOrFail();
//
//    $github_user = Socialite::driver($oath_service->provider)->stateless()->userFromToken($oath_service->service_token);
//    $app_user = $oath_service->user->toArray();
//
//    dd(compact('github_user', 'app_user'));
//});

Route::get('provider/callback/{provider}/log-all', function ($provider) {
    logger()->info("Provider: {$provider} log entry");
    logger()->info(request()->all());
});
