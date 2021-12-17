<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain'   => env('MAILGUN_DOMAIN'),
        'secret'   => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_REGION', 'us-east-1'),
    ],

    'fmapi' => [
        'host'    => env('FM_API_HOST'),
        'timeout' => 30,
        'version' => 'vLatest',
        'db'      => 'DME_New',
        'user'    => env('FM_API_USER'),
        'pass'    => env('FM_API_PASS'),
    ],

    'sso_providers' => null === ($providers = env('SSO_PROVIDERS',
        null)) || empty($providers) ? [] : array_filter(array_map('trim', explode(',', $providers))),

    'github' => [
        'client_id'     => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect'      => env('SSO_CALLBACK_URL', ''),
    ],

    'pdf' => [
        'page_width'      => 612,
        'page_height'     => 792,
        'page_horzmargin' => 80,
        'page_vertmargin' => 60,
        'template_path'   => resource_path('views/vendor/pdf'),

        'font_body'     => "Roboto",
        'font_bold'     => "Roboto-Bold",
        'font_light'    => "Roboto-Light",
        'font_italic'   => "Roboto-Italic",
        'font_angelina' => "Angelina",

        'pdflib_key' => env('PDFLIB_KEY', "L900202-019090-143865-PB3Z22-9ZYUC2"),
    ],

];
