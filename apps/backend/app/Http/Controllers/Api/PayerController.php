<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ImageResource;
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
     * Display the specified resource.
     *
     * @param Payer $payer
     * @return Response
     */
    public function show(Payer $payer)
    {
        return new PayerResource($payer);
    }

    public function avatarSave(Request $request, Payer $payer)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        $file = $request->file('file');

        // attach this image to this payer
        $avatar = $payer->image()->updateOrCreate([
            'name'      => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
        ]);

        // upload the file to the storage
        $avatar->file = $request->file('file');
        $avatar->save();

        return new ImageResource($avatar);
    }
}
