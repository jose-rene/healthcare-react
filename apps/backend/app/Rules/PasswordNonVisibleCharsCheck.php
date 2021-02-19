<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class PasswordNonVisibleCharsCheck implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $array = str_split($value);

        foreach ($array as $v) {
            if (ctype_cntrl($v)) {
                return false;
            }

            // eg ";" are used in injections and can trigger the WAF, per the following regex
            if (preg_match(config('rules.patterns.password'), $v)) {
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
        return 'Must not include non-printing characters';
    }
}
