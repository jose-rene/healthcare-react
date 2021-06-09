<?php

namespace App\Http\Controllers\Api;

use App\Events\UserLoggedIn;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TwoFactorAuthApp;
use App\Services\TwoFactorAuthMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Post(
 * path="/v1/login",
 * summary="Sign in",
 * description="Login by email, password",
 * operationId="authLogin",
 * tags={"auth"},
 * @OA\RequestBody(
 *    required=true,
 *    description="Pass user credentials",
 *    @OA\JsonContent(
 *       required={"email","password"},
 *       @OA\Property(property="email", type="string", format="email", example="user1@mail.com"),
 *       @OA\Property(property="password", type="string", format="password", example="PassWord12345"),
 *    ),
 * ),
 * @OA\Response(
 *     response=200,
 *     description="Success",
 *     @OA\JsonContent(
 *       @OA\Property(property="access_token", type="string"),
 *       @OA\Property(property="token_type", type="string"),
 *       @OA\Property(property="expires_at", type="string", format="date-time"),
 *     )
 *  ),
 * @OA\Response(
 *    response=401,
 *    description="Wrong credentials response",
 *    @OA\JsonContent(
 *       @OA\Property(property="message", type="string", example="Unauthorized")
 *        )
 *     )
 * )
 */
class LoginController extends Controller
{
    /**
     * login api.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        // validate
        $request->validate([
            'email'    => 'bail|required|email|max:255',
            'password' => 'required|string|min:8|max:64',
        ]);

        $credentials = $request->only(['email', 'password']);

        if (!auth()->attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = auth()->user();
        if ($user->is_2fa) {
            $class = 'email' === $user->twofactor_method || 'sms' === $user->twofactor_method ? TwoFactorAuthMessage::class : TwoFactorAuthApp::class;
            $params = App::make($class)->send($user);

            return response()->json($params, 200);
        }

        event(new UserLoggedIn($user));

        return response()->json($user->getAuthTokens($request));
    }

    /**
     * One time password check.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function otp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'bail|required|email|max:255',
            'code'  => 'required|string|min:6|max:8',
            'token' => 'required|string|min:8|max:64',
        ]);
        // validate the two factor auth
        $class = 0 === strpos($request['token'], 'tfn:') ? TwoFactorAuthMessage::class : TwoFactorAuthApp::class;
        $user = App::make($class)->validate($request['code'], $request['email'], $request['token']);
        // user 2fa successful, send bearer token
        auth()->login($user);
        event(new UserLoggedIn($user));

        return response()->json($user->getAuthTokens());
    }

    /**
     * Request a user token from the signed url generated after 3rd party federation.
     *
     * @param Request $request
     * @param string $email
     * @return Response
     */
    public function requestToken(Request $request, $email)
    {
        // validate signature
        abort_unless($request->hasValidSignature(), 401, 'Invalid token');

        if (null !== ($user = User::select('id')->where('email', $email)->first()) && !empty($user)) {
            Auth::login($user);
            event(new UserLoggedIn($user));

            return response()->json(auth()->user()->getAuthTokens($request));
        }

        return response()->json(['message' => 'Unauthorized: user not found.'], 401);
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        $user->token()->revoke();

        return response()->json(['error' => false, 'message' => 'logged-out']);
    }
}
