<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClinicalServicesUserRequest;
use App\Http\Resources\UserResource;
use App\Jobs\Admin\CreateUserJob;
use App\Models\ClinicalType;
use App\Models\ClinicalUserStatus;
use App\Models\ClinicalUserType;
use App\Models\TherapyNetwork;
use App\Models\User;
use Bouncer;
use Illuminate\Http\Request;

class ClinicalServicesUserController extends Controller
{
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ClinicalServicesUserRequest $request)
    {
        dispatch($job = new CreateUserJob($request, 'ClinicalServicesUser'));
        return new UserResource($job->getUser());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function search(Request $request)
    {
        $users = User::where('user_type', 3)
            ->whereHas('clinicalServicesUser', function ($query) use ($request) {
                $query->where('clinical_user_status_id', $request->status_id ?? 1);
                if (!empty($request->type_id)) {
                    $query->where('clinical_user_type_id', $request->type_id);
                }
            })
            ->paginate(request('perPage', 50));

        return UserResource::collection($users);
    }

    public function params()
    {
        $map = fn ($item) => ['id' => $item['id'], 'name' => $item['name']];
        $data = [
            'user_statuses'    => ClinicalUserStatus::all()->map($map),
            'user_types'       => ClinicalUserType::all()->map($map),
            'types'            => ClinicalType::all()->map($map),
            'therapy_networks' => TherapyNetwork::all()->map($map),
            'roles'            => Bouncer::role()->where('domain', 'Clinical Services')->get(['name', 'title']),
        ];
        return response()->json($data);
    }
}
