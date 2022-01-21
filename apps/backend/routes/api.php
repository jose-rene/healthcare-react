<?php

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
Route::get('/ssologin/{email}', 'LoginController@requestToken')->name('ssologin');

Route::middleware('auth:api')->group(function ($router) {
    $router->get('/payer/profile', 'PayerController@profile')->name('company.profile');
    $router->get('/icd10code/lookup', 'Icd10CodeController@lookup')->name('icd10code.lookup');
    // @todo deprecate these test routes, will be supersceded by payer and lobs
    $router->get('/plan/plans', 'PlanController@plans');
    $router->get('/plan/lobs', 'PlanController@lobs');
    $router->get('/plan/idtypes', 'PlanController@idtypes');

    // user routes
    $router->delete('/profile', 'UserController@profileDelete')->name('user.profile.delete');
    $router->get('/user/profile', 'UserController@profile')->name('user.profile');
    $router->put('/user/profile', 'UserController@profileSave')->name('user.profile.save');
    $router->post('/user/profile-image', 'UserController@profileImageSave')->name('user.profile.image.save');
    $router->put('/user/password', 'PasswordController@authedChangePassword');
    $router->put('/user/password-confirmed', 'PasswordController@authedChangePasswordWithConfirm');

    // clinical user routes
    Route::put('clinicaluser/update', 'ClinicalServicesUserController@update')->name('clinicaluser.update');
    Route::get('clinicaluser/params', 'ClinicalServicesUserController@params')->name('clinicaluser.params');

    $router->post('/member/search', 'MemberController@search')->middleware('can:viewAny,' . Member::class);
    $router->post('/user/search', 'UserController@search');
    $router->get('/user/available_roles', 'UserController@availableRoles');
    $router->get('logout', 'LoginController@logout');
    $router->get('notifications', 'NotificationsController@index')->name('notifications.index');
    $router->put('notifications', 'NotificationsController@update')->name('notifications.update');
    $router->put('notifications/dismiss', 'NotificationsController@dismiss')->name('notifications.dismiss');
    $router->delete('notifications', 'NotificationsController@destroy')->name('notifications.destroy');

    // request info
    $router->get('/request/summary', 'RequestController@summary');
    $router->get('/request/inspire', 'RequestController@inspire');
    $router->get('/request/list', 'RequestController@inspire');
    $router->put('/request/{request}/assign/', 'RequestController@assign')->name('request.assign');

//    $router->get('/request/types', [RequestTypesController::class, 'index'])->name('request.types.index');
//    $router->get('/requesttype', 'RequestTypeController@index')->name('requesttypes.index');

    // Payer
    $router->put('/payer/avatar', 'Payercontroller@avatarSave');

    // protected crud routes
    Route::apiResource('questionnaire', 'QuestionnaireController');
    // @deprecated
    // Route::apiResource('assessment', 'AssessmentController');
    Route::apiResource('request', 'RequestController');
    Route::apiResource('member', 'MemberController');
    Route::apiResource('payer', 'PayerController')->except(['store', 'update', 'destroy']);
    Route::apiResource('member.member-requests', 'MemberRequestController')->only('store', 'show', 'update');
    Route::apiResource('member-request.request-item', 'RequestRequestItemController')->only('store', 'show', 'update');
    Route::apiResource('activity', 'ActivityController');
    Route::apiResource('user', 'UserController');
    Route::apiResource('document', 'DocumentController')->only('store', 'update', 'destroy');
    Route::apiResource('professional_document', 'ProfessionalDocumentController')->only('store', 'update', 'destroy');
    Route::apiResource('training_document', 'TrainingDocumentsController')->only('index');
    Route::apiResource('request.document', 'DocumentRequestController')->only('index', 'store', 'update', 'destroy');
    Route::apiResource('form', 'FormController');
    Route::apiResource('request.form', 'RequestFormController');
    Route::apiResource('narrative_report_template', 'NarrativeReportTemplatesController');
    Route::apiResource('appointment', 'AppointmentController');
    Route::apiResource('classification', 'ClassificationController')->only(['index', 'show']);


    Route::apiResource('request.narrative_report_template', 'RequestNarrativeReportTemplateController')->only('show',
        'update');

    Route::put('/form/{form}/snapshot', 'FormController@snapshot');
    Route::put('/form/{form}/rollback', 'FormController@rollback');

    Route::post('appointment/reschedule', 'AppointmentController@reschedule')->name('appointment.reschedule');

    Route::get('request/{request}/request_form_section/{form}',
        'RequestFormSectionController@show');
    Route::put('request/{request}/request_form_section/{form}',
        'RequestFormSectionController@update');

    Route::get('assessment/{request}', 'RequestAssessmentController@show')->name('request.assessment.show');
    Route::put('assessment/{request}/media', 'RequestAssessmentController@media')->name('request.assessment.media');
    Route::post('assessment/{request}/consideration', 'RequestAssessmentController@consideration')->name('request.assessment.consideration');
    Route::put('assessment/{request}/diagnosis', 'RequestAssessmentController@diagnosis')->name('request.assessment.diagnosis');
    Route::get('assessment/{request}/section/{form}', 'RequestAssessmentController@section')->name('request.assessment.section');

    Route::apiResource('request.request_form_section', 'RequestFormSectionController')->only('show', 'update');
    Route::apiResource('form.form_answers', 'FormAnswerController')->only(['store', 'show', 'update']);
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

    Route::get('permissions/check', 'UserController@permissionCheck')->name('permissions.check');
});

Route::post('login', 'LoginController@login')->name('login');
Route::post('login/otp', 'LoginController@otp')->name('login_otp');
Route::get('password/history/check', 'PasswordController@check');

// add OPTIONS route to fire cors middleware for preflight
Route::options('/{any}', function () {
    return response()->json(['message' => true]);
})->where('any', '.*');

Route::options('/', function () {
    return response()->json(['message' => true]);
});
