<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PayerResource;
use App\Models\Payer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PayerController extends Controller
{
    /**
     * Create the controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // uses App\Policies\PayerPolicy
        $this->authorizeResource(Payer::class, 'payer');
    }

    /**
     * Get the map of resource methods to ability names.
     * Overrides the AuthorizesRequests trait function.
     *
     * @return array
     */
    protected function resourceAbilityMap()
    {
        return [
            'index'   => 'viewAny',
            'show'    => 'view',
            'create'  => 'create',
            'store'   => 'create',
            'edit'    => 'update',
            'update'  => 'update',
            'destroy' => 'delete',
            'profile' => 'profile',
        ];
    }

    /**
     * Get the list of resource methods which do not have model parameters.
     * Overrides the AuthorizesRequests trait function.
     *
     * @return array
     */
    protected function resourceMethodsWithoutModels()
    {
        return ['index', 'create', 'store', 'profile'];
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the company profile for the current user.
     *
     * @return PayerResource
     */
    public function profile()
    {
        abort_if(!($payer = auth()->user()->payer), 406, 'wrong-user_type');

        return new PayerResource($payer);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param Payer $payer
     * @return Response
     */
    public function show(Payer $payer)
    {
        return new PayerResource($payer);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Payer $payer
     * @return Response
     */
    public function edit(Payer $payer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Payer   $payer
     * @return Response
     */
    public function update(Request $request, Payer $payer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Payer $payer
     * @return Response
     */
    public function destroy(Payer $payer)
    {
        //
    }
}
