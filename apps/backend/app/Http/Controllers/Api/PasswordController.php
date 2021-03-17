<?php

namespace App\Http\Controllers\Api;

use App\Events\UserChangingPassword;
use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordValidationRequest;
use App\Models\User;

class PasswordController extends Controller
{

    public function check(PasswordValidationRequest $request)
    {
        return response()->json(['message' => 'ok']);
    }

    public function authedChangePassword(PasswordValidationRequest $request)
    {
        /** @var User $user */
        $user = auth()->user();

        $originalPassword = $user->password;
        $user->update(['password' => bcrypt($request->get('password'))]);

        UserChangingPassword::dispatch($user, $originalPassword);

        return response()->json(['message' => 'ok']);
    }
}
