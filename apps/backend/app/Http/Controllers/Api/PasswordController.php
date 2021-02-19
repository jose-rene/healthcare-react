<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\PasswordContiguousRule;
use App\Rules\PasswordLastN;
use App\Rules\PasswordNonVisibleCharsCheck;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;

class PasswordController extends Controller
{
    use ResetsPasswords;

    public function check(Request $request)
    {
        $credentials = $request->only(['email']);
        /** @var User $user */
        $user = $this->broker()->getUser($credentials);

        // Check password history and some basic
        // requirements if validation fails this function will return what failed in validation
        $request->validate(
            [
                'password' => [
                    'required',           // something is required
                    'confirmed',          // makes sure that password and password_confirmation matches
                    'min:8',              // minimum password requirement
                    'regex:/[a-z]/',      // must contain at least one lowercase letter
                    'regex:/[A-Z]/',      // must contain at least one uppercase letter
                    'regex:/[0-9]/',      // must contain at least one digit
                    new PasswordLastN($user),
                    new PasswordContiguousRule($user),
                    new PasswordNonVisibleCharsCheck(),
                ],
            ]
        );

        return response()->json(['message' => 'ok']);
    }
}
