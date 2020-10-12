<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    public function welcome()
    {
        return response()->json(['message' => 'placeholder']);
    }
}
