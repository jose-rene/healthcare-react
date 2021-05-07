<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Google2FA;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

        if (auth()->user()->is_2fa) {
            $params = [];
            // there is not a secret yet, send the qr code so that user can set up 2fa
            if (!auth()->user()->google2fa_secret) {
                // generate the secret and show QR code
                auth()->user()->update(['google2fa_secret' => Google2FA::generateSecretKey(32)]);
                $params['qr_image'] = Google2FA::getQRCodeInline(
                    'DME-CG',
                    $email = auth()->user()->email,
                    auth()->user()->google2fa_secret
                );
            }
            $params['otp_url'] = route('api.login_otp');
            $params['otp_token'] = Str::random(40);
            Cache::put('otp_' . $email, Hash::make($params['otp_token']), 300);

            return response()->json($params, 200);
        }

        return response()->json(auth()->user()->getAuthTokens($request));
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
        // retrieve temporary token
        if (null === ($token = Cache::get('otp_' . $request['email']))) {
            return response()->json(['message' => 'OTP Token Expired.'], 401);
        }
        // verify the token
        if (!Hash::check($request['token'], $token)) {
            return response()->json(['message' => 'OTP Token Mismatch.'], 401);
        }
        // fetch the user
        if (null === ($user = User::firstWhere('email', $request['email']))) {
            return response()->json(['message' => 'User Not Found.'], 401);
        }
        // clear the one time token
        Cache::forget('otp_', $request['email']);
        // check the otp, clean code in case the user adds the space
        if (!Google2FA::verifyGoogle2FA($user->google2fa_secret, preg_replace('~[^0-9]~', '', $request['code']))) {
            $token = Str::random(40);
            Cache::put('otp_' . $user->email, Hash::make($token), 300);

            return response()->json([
                'message'     => 'OTP Bad Code',
                'retry_token' => $token,
            ], 422);
        }
        // user 2fa successful, send bearer token
        auth()->login($user);

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
