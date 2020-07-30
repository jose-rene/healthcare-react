<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $user = User::create([
            'first_name'        => '',
            'last_name'         => '',
            'email'             => $request->get('email'),
            'password'          => bcrypt($request->get('password')),
            'notification_type' => ['at-now', 'at-upcoming']
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'user-created',
            'email'   => $user->email,
        ]);
    }
}
