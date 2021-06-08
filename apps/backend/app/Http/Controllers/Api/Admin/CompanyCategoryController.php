<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payer;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

class CompanyCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        if (!auth()->user()->can('create-payers')) {
            throw new AuthorizationException('You are not authorized for this resource');
        }

        $data = [
            'categories' => [
                ['id' => 2, 'name' => 'Facility'],
                ['id' => 1, 'name' => 'Payer'],
                ['id' => 3, 'name' => 'Therapy Network'],
                ['id' => 4, 'name' => 'Vendor'],
            ],
            'payer_categories' => collect(Payer::getCategories())->map(fn($cat, $i) => ['id' => $i, 'name' => $cat])->toArray(),
        ];

        return response()->json($data);
    }
}
