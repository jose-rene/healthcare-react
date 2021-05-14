<?php

namespace App\Services;

use App\Contracts\TwoFactorAuth;
use App\Models\User;
use App\Notifications\TwoFactorNotification;
use Google2FA;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorAuthMessage implements TwoFactorAuth
{
    public function send(User $user)
    {
        $params = [];
        $params['otp_url'] = route('api.login_otp');
        $params['otp_token'] = 'tfn:' . Str::random(40);
        $code = $this->generateCode();
        Cache::put('otp_' . $user->email, Hash::make($params['otp_token'] . ':' . $code), 300);
        $user->notify(new TwoFactorNotification($code));

        return $params;
    }

    public function validate($code, $email, $requestToken)
    {
        // retrieve temporary token
        if (null === ($token = Cache::get('otp_' . $email))) {
            throw new HttpResponseException(response()->json(['message' => 'OTP Token Expired.'], 401));
        }
        // fetch the user
        if (null === ($user = User::firstWhere('email', $email))) {
            throw new HttpResponseException(response()->json(['message' => 'User Not Found.'], 401));
        }
        // clear the one time token
        Cache::forget('otp_', $email);
        // the stored token includes the code, append the input code
        $requestToken .= ':' . preg_replace('~[^0-9]~', '', $code);
        // verify the token and code
        if (!Hash::check($requestToken, $token)) {
            throw new HttpResponseException(response()->json(['message' => 'OTP Token or Code Mismatch.'], 401));
        }

        return $user;
    }

    protected function generateCode($length = 6)
    {
        $code = '';
        for ($xx = 0; $xx < $length; $xx++) {
            $code .= current(Arr::random([1, 2, 3, 4, 5, 6, 7, 8, 9], 1));
        }

        return $code;
    }
}
