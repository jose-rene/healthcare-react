<?php

namespace App\Contracts;

use App\Models\User;

interface TwoFactorAuth
{
    public function validate($code, $email, $requestToken);

    public function send(User $user);
}
