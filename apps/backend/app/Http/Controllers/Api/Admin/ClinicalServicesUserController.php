<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClinicalServicesUserRequest;
use App\Http\Resources\UserResource;
use App\Jobs\Admin\UserCreateJob;
use App\Jobs\Admin\UserUpdateJob;
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
     * Store a newly created resource in storage.
     *
     * @param  ClinicalServicesUserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ClinicalServicesUserRequest $request)
    {
        dispatch($job = new UserCreateJob($request, 'ClinicalServicesUser'));
        return new UserResource($job->getUser());
    }

    /**
     * Display the specified resource.
     *
     * @param  User $clinicaluser
     * @return \Illuminate\Http\Response
     */
    public function show(User $clinicaluser)
    {
        return new UserResource($clinicaluser);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  ClinicalServicesUserRequest  $request
     * @param  User $clinicaluser
     * @return \Illuminate\Http\Response
     */
    public function update(ClinicalServicesUserRequest $request, User $clinicaluser)
    {
        // @note variable name for User has to match route param, ie, cannot use $user as param
        dispatch($job = new UserUpdateJob($request, $clinicaluser, 'ClinicalServicesUser'));
        return new UserResource($clinicaluser);
    }

    public function search(Request $request)
    {
        // only check if the role is available, not if it is primary role
        if ($request->has('type_id')) {
            switch ($request->type_id) {
                case 2:
                    $query = User::whereIs('clinical_reviewer', 'reviewer_manager');
                break;
                case 1:
                    $query = User::whereIs('field_clinician', 'clinical_reviewer', 'reviewer_manager');
                break;
            }
        }
        else {
            $query = User::where('user_type', 3);
        }

        $users = $query->whereHas('clinicalServicesUser', function ($query) use ($request) {
                $query->where('clinical_user_status_id', empty($request->status_id) ? 1 : $request->status_id);
                // @deprecated, this will depend upon role
                /* if (!empty($request->type_id)) {
                    $query->where('clinical_user_type_id', $request->type_id);
                }*/
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
