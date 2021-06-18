<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CompanyContactRequest;
use App\Http\Requests\Admin\PayerRequest;
use App\Http\Resources\PayerResource;
use App\Models\Payer;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayerController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = Payer::searchPayers()->paginate($request->get('perPage', 50));

        return PayerResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(PayerRequest $request)
    {
        $payer = Payer::create($request->validated());

        return new PayerResource($payer);
    }

    /**
     * Display the specified resource.
     *
     * @param Payer $payer
     * @return JsonResponse
     */
    public function show(Payer $payer)
    {
        return new PayerResource($payer);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Payer   $payer
     * @return JsonResponse
     */
    public function update(PayerRequest $request, Payer $payer)
    {
        $payer->update($data = $request->validated());

        if (!empty($data['member_number_types'])) {
            $payer->memberNumberTypes()->sync($data['member_number_types']);
        }

        return new PayerResource($payer);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Payer $payer
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Payer $payer)
    {
        $payer->delete();

        return response()->json(['message' => 'ok']);
    }

    /**
     * Add contacts to the Payer.
     *
     * @param Request $request
     * @param Payer   $payer
     * @return JsonResponse
     */
    public function contact(CompanyContactRequest $request, Payer $payer)
    {
        $data = $request->validated();
        $payer->addContacts($data['contacts']);

        return new PayerResource($payer);
    }
}
