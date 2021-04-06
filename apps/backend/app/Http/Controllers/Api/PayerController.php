<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PayerResource;
use App\Models\Payer;
use Illuminate\Http\Request;

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
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the company profile for the current user.
     *
     * @return \Illuminate\Http\Response
     */
    public function profile()
    {
        return new PayerResource(auth()->user()->payer()->first());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payer  $payer
     * @return \Illuminate\Http\Response
     */
    public function show(Payer $payer)
    {
        return new PayerResource($payer);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Payer  $payer
     * @return \Illuminate\Http\Response
     */
    public function edit(Payer $payer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payer  $payer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Payer $payer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Payer  $payer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payer $payer)
    {
        //
    }
}
