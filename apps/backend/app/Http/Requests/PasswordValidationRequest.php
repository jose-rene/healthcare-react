<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\PasswordContiguousRule;
use App\Rules\PasswordLastN;
use App\Rules\PasswordNonVisibleCharsCheck;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Foundation\Http\FormRequest;

class PasswordValidationRequest extends FormRequest
{
    use ResetsPasswords;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if (($user = request()->user('api')) == null) {
            $credentials = request()->only(['email']);
            /** @var User $user */
            $user = $this->broker()->getUser($credentials);
        }

        return [
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
        ];
    }
}
