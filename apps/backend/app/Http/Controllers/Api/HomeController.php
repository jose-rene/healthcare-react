<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Library\FmDataApi;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['welcome']);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function welcome()
    {
        return view('welcome');
    }

    public function fmtest(Request $request, FmDataApi $fmDataApi)
    {
        return response()->json(['message' => 'data api ready']);
    }
}
