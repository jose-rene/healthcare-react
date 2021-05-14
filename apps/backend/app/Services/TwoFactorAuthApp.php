<?php

namespace App\Services;

use App\Contracts\TwoFactorAuth;
use App\Models\User;
use Google2FA;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorAuthApp implements TwoFactorAuth
{
    public function send(User $user)
    {
        $params = [];
        // there is not a secret yet, send the qr code so that user can set up 2fa
        if (!$user->google2fa_secret) {
            // generate the secret and show QR code
            $user->update(['google2fa_secret' => Google2FA::generateSecretKey(32)]);
            $params['qr_image'] = Google2FA::getQRCodeInline(
                    'DME-CG',
                    $user->email,
                    $user->google2fa_secret
                );
        }
        $params['otp_url'] = route('api.login_otp');
        $params['otp_token'] = Str::random(40);
        Cache::put('otp_' . $user->email, Hash::make($params['otp_token']), 300);

        return $params;
    }

    public function validate($code, $email, $requestToken)
    {
        // retrieve temporary token
        if (null === ($token = Cache::get('otp_' . $email))) {
            throw new HttpResponseException(response()->json(['message' => 'OTP Token Expired.'], 401));
        }
        // verify the token
        if (!Hash::check($requestToken, $token)) {
            throw new HttpResponseException(response()->json(['message' => 'OTP Token Mismatch.'], 401));
        }
        // fetch the user
        if (null === ($user = User::firstWhere('email', $email))) {
            throw new HttpResponseException(response()->json(['message' => 'User Not Found.'], 401));
        }
        // clear the one time token
        Cache::forget('otp_', $email);
        // check the otp, clean code in case the user adds the space
        if (!Google2FA::verifyGoogle2FA($user->google2fa_secret, preg_replace('~[^0-9]~', '', $code))) {
            $token = Str::random(40);
            Cache::put('otp_' . $user->email, Hash::make($token), 300);
            throw new HttpResponseException(response()->json(['message' => 'OTP Bad Code', 'retry_token' => $token], 422));
        }

        return $user;
    }
}
