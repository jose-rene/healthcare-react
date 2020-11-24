<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * @OA\Get(
 *   path="/",
 *   description="Welcome",
 *   @OA\Response(
 *     response=200,
 *     description="Welcome page",
 *     @OA\JsonContent(
 *       @OA\Property(property="message", type="string", example="placeholder")
 *     )
 *   )
 * )
 */
class HomeController extends Controller
{
    public function welcome()
    {
        return response()->json(['message' => 'placeholder']);
    }
}
