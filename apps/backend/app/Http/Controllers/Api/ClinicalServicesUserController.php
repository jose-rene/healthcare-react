<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClinicalServicesUserRequest;
use App\Http\Resources\MyUserResource;
use App\Http\Resources\UserResource;
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
    public function update(ClinicalServicesUserRequest $request)
    {
        // check the user policy for permissions
        $user = $request->user();
        $policy = policy(User::class);
        abort_if(!$policy->update(auth()->user(), $user), 403, 'You do not have permissions for this resource');

        // update
        $data = $request->validated();
        // save notification prefs to the the appropriate key
        $notificationPrefs = empty($data['notification_prefs']) ? [] : $data['notification_prefs'];
        $prefs = null === $user->notification_prefs ? [] : $user->notification_prefs;
        $prefs['notifications'] = $data['notification_prefs'];
        $data['notification_prefs'] = $prefs;
        // update user
        $user->update($data);
        if (!empty($data['title']) && $user->clinicalServicesUser->title !== $data['title']) {
            $user->clinicalServicesUser()->update(['title' => $data['title']]);
        }
        if (!empty($data['phone']) && $user->main_phone !== $data['phone']) {
            $user->phones()->create([
                'number'         => $data['phone'],
                'is_primary'     => 1, 
                'phoneable_type' => User::class, 
                'phoneable_id'   => $user->id
            ]);
            $user->refresh();
        }

        return new MyUserResource($user);
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
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
