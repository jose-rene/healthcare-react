<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity\Activity;
use App\Models\Request as modelRequest;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$request['request_id']) {
            if (!$user->can('view-all-requests') && !$user->isA('client_services_specialist')) {
                return response()->json([]);
            }
            $data = Activity::orderBy('id', 'desc')->paginate($request->get('perPage', 50));
            return ActivityResource::collection($data);
        }
        if (null === ($modelRequest = modelRequest::firstWhere('uuid', $request['request_id']))) {
            return response()->json([]);
        }
        $data = $modelRequest->activities()->paginate($request->get('perPage', 50));

        return ActivityResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\ActivityRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ActivityRequest $request)
    {
        $user = auth()->user();
        $data = $request->validated();
        // get request from uuid
        $modelRequest = modelRequest::firstWhere('uuid', $data['request_id']);
        $data['request_id'] = $modelRequest->id;
        $data['user_id'] = $user->id;
        $parent = null; // activity being replied to
        if (!empty($data['parent_id'])) {
            $parent = Activity::firstWhere('uuid', $data['parent_id']);
            $data['parent_id'] = $parent->id;
        }
        // create the activity
        $activity = Activity::create($data);

        return new ActivityResource($activity);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function show(Activity $activity)
    {
        return new ActivityResource($activity);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Activity\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Activity $activity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function destroy(Activity $activity)
    {
        //
    }
}
