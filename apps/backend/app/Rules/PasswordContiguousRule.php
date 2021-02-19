<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class PasswordContiguousRule implements Rule
{
    /**
     * @var User
     */
    private User $user;

    /**
     * Create a new rule instance.
     *
     * @param User $user
     */
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
//        $value = strtolower($value);
////        $account_name = $this->user->account->name;
//
//        $full_name_len = strlen($full_name);
////        $account_name_len = strlen($account_name);
//
//        $consecutive_char_count = 3; // one less then the required
//
//        for ($i = 0; ($i + $consecutive_char_count) <= $full_name_len; $i++) {
//            $checking_for = substr($full_name, $i, $consecutive_char_count);
//            $find = strpos($value, $checking_for);
//
//            if ($find !== false) {
//                return false;
//            }
//        }


        $dataPoints = ['name', 'email', 'username'];

        foreach ($dataPoints as $point) {
            if (!$this->consecutiveCheck($value, $this->user[$point])) {
                return false;
            }
        }

        return true;
    }

    public function consecutiveCheck($value, $check)
    {
        $value = strtolower($value);
        $check = strtolower($check);
        $test_len = strlen($check);
        $consecutive_char_count = 3; // one less then the required

        for ($i = 0; ($i + $consecutive_char_count) <= $test_len; $i++) {
            $checking_for = substr($check, $i, $consecutive_char_count);
            $find = strpos($value, $checking_for);

            if ($find !== false) {
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
        return 'Must not include three or more contiguous characters of your account name or full name.';
    }
}
