<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CompanyContactRequest;
use App\Http\Requests\Admin\EmailRequest;
use App\Http\Requests\Admin\PayerRequest;
use App\Http\Requests\Admin\PhoneRequest;
use App\Http\Resources\EmailResource;
use App\Http\Resources\PayerResource;
use App\Http\Resources\PhoneResource;
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

    /**
     * Update the specified payer's phone.
     *
     * @param Request $request
     * @param Payer   $payer
     * @param string $id
     * @return JsonResponse
     */
    public function updatePhone(PhoneRequest $request, Payer $payer, $id)
    {
        abort_if(null === ($phone = $payer->phones->firstWhere('uuid', $id)), 422, 'Phone not found.');
        $phone->update($request->validated());

        return new PhoneResource($phone);
    }

    /**
     * Update the specified payer's email.
     *
     * @param Request $request
     * @param Payer   $payer
     * @param string $id
     * @return JsonResponse
     */
    public function updateEmail(EmailRequest $request, Payer $payer, $id)
    {
        abort_if(null === ($email = $payer->emails->firstWhere('uuid', $id)), 422, 'Email not found.');
        $email->update($request->validated());

        return new EmailResource($email);
    }

    /**
     * Remove the payer's phone from storage.
     *
     * @param Payer $payer
     * @param string $id
     * @return JsonResponse
     * @throws Exception
     */
    public function destroyPhone(Payer $payer, $id)
    {
        abort_if(null === ($phone = $payer->phones->firstWhere('uuid', $id)), 422, 'Phone not found.');
        abort_if(2 > $payer->phones->count(), 422, 'You cannot remove all phone contacts.');

        $phone->delete();

        return response()->json(['message' => 'ok']);
    }

    /**
     * Remove the payer's email from storage.
     *
     * @param Payer $payer
     * @param string $id
     * @return JsonResponse
     * @throws Exception
     */
    public function destroyEmail(Payer $payer, $id)
    {
        abort_if(null === ($email = $payer->emails->firstWhere('uuid', $id)), 422, 'Email not found.');
        abort_if(2 > $payer->emails->count(), 422, 'You cannot remove all email contacts.');
        $email->delete();

        return response()->json(['message' => 'ok']);
    }
}
