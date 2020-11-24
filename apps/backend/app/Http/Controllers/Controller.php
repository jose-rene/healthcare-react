<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

// app/Http/Controllers/Controller.php
/**
 * @OA\Info(
 *     description="This is the DME API Server.",
 *     version="1.0.0",
 *     title="DME API Service",
 *     termsOfService="https://www.dme-cg.com/terms",
 *     @OA\Contact(
 *         email="devs@dme-cg.com"
 *     )
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
