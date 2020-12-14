<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Arr;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\URL;
use Laravel\Socialite\Facades\Socialite;
use Str;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * @param User $user
     * @return Application|ResponseFactory|Response
     */
    public function jsonResponse(User $user)
    {
        $token = $user->createToken('dme')->accessToken;

        return response(compact('token'));
    }

    /**
     * redirect to the oath providers login page.
     * @param string $provider
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectToProvider(string $provider): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        // validate provider
        $validProviders = config('services.sso_providers');
        abort_unless(in_array($provider, $validProviders), 401, 'Invalid provider');

        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Obtain the user information from the oath provider and create or get the user in the db
     * and log the providers token in the tokens table to be used at a later date.
     *
     * @param string $provider
     * @return RedirectResponse
     */
    public function handleProviderCallback(string $provider): RedirectResponse
    {
        // validate provider
        $validProviders = config('services.sso_providers');
        abort_unless(in_array($provider, $validProviders), 401, 'Invalid provider');

        $user = Socialite::driver($provider)->stateless()->user();

        $token = $user->token;

        $findBy = (bool) $user->email ? 'email' : 'username';
        $findByValue = $user->email ?? $user->nickname;
        $name = explode(' ', $user->name);

        /** @var User $user */
        $user = User::firstOrCreate([$findBy => $findByValue], [
            'last_name'  => Arr::last($name),
            'first_name' => $name[0] ?? '',
            'email'      => $user->email ?? $user->nickname . '-autogen@dme-cg.com',
            'username'   => $user->nickname,
            'password'   => bcrypt(Str::random(16)),
        ]);

        $user->OathClients()->firstOrCreate([
            'provider'      => $provider,
            'service_token' => $token,
        ], [
            'provider'      => $provider,
            'service_token' => $token,
            'is_default'    => true,
        ]);

        // signed url to request a passport token
        $url = URL::temporarySignedRoute(
            'ssologin', now()->addMinutes(env('SSO_URL_TIMEOUT', 5)), ['email' => $user->email]
        );

        $urlInfo = parse_url($url);
        $redirect = env('FRONTEND_SSO_URL', '') . '?path=' . rawurlencode($urlInfo['path']) . '&' . $urlInfo['query'];

        return redirect()->away($redirect);
    }

    /**
     * Send the response after the user was authenticated.
     *
     * @param Request $request
     * @return RedirectResponse|Response
     */
    protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();

        $this->clearLoginAttempts($request);

        $user = $this->guard()->user();

        if ($response = $this->authenticated($request, $user)) {
            return $response;
        }

        return $request->wantsJson()
            ? $this->jsonResponse($user)
            : redirect()->intended($this->redirectPath());
    }
}
