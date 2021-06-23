<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CompanyRequest;
use App\Http\Resources\PayerResource;
use App\Http\Resources\TherapyNetworkResource;
use App\Models\MemberNumberType;
use App\Models\Payer;
use App\Models\TherapyNetwork;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(CompanyRequest $request)
    {
        $data = $request->validated();

        switch ($data['category']) {
            case 1: // payer
                $payer = Payer::create($data);

                return new PayerResource($payer);
            break;
            case 3:
                $therapyNetwork = TherapyNetwork::create($data);

                return new TherapyNetworkResource($therapyNetwork);
            break;
        }
    }

    public function categories(Request $request)
    {
        $this->authorize('create-payers');

        $data = [
            'categories' => [
                ['id' => 2, 'name' => 'Facility'],
                ['id' => 1, 'name' => 'Payer'],
                ['id' => 3, 'name' => 'Therapy Network'],
                ['id' => 4, 'name' => 'Vendor'],
            ],
            'payer_categories'    => collect(Payer::getCategories())->map(fn ($cat, $i) => ['id' => $i, 'name' => $cat])->values(),
            'member_number_types' => MemberNumberType::all()->map(fn ($type) => ['id' => $type['id'], 'name' => $type['title']]),
        ];

        return response()->json($data);
    }
}
