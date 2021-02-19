<?php

namespace App\Rules;

use App\Models\User;
use Hash;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Str;

class PasswordLastN implements Rule
{
    /**
     * @var User
     */
    private User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $oldPasswords = $this->user->last_n_passwords;

        foreach ($oldPasswords as $oldPassword) {
            if (Hash::check($value, $oldPassword->password)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Cannot match last ' . config('rules.last_n', 6) . ' ' . Str::plural(
                'passwords',
                config('rules.last_n', 6)
            );
    }
}
