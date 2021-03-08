<?php

return [
    //  Rules based requirements
    'last_n' => 6,

    'patterns' => [
        'password'        => '/^[a-zA-Z 0-9!_:~#@\.\,\(\)\{\}\[\]\+\-\$]+$/',
        'password_negate' => '/[^a-zA-Z 0-9!_:~#@\.\,\(\)\{\}\[\]\+\-\$]/',
    ],
];
