<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequestResource;
use App\Models\Member;
use App\Models\Request as MemberRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class MemberRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Member  $member
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Member $member, Request $request)
    {
        $data = $member->requests()->paginate($request->get('perPage', 50));

        return RequestResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Member $member
     * @return RequestResource
     */
    public function store(Member $member)
    {
        $memberRequest = $member->requests()->create([
            'status' => 'started',
        ]);

        return new RequestResource($memberRequest);
    }

    /**
     * Display the specified resource.
     *
     * @param Member        $member
     * @param MemberRequest $memberRequest
     * @return RequestResource
     */
    public function show(Member $member, MemberRequest $memberRequest)
    {
        return new RequestResource($memberRequest);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request       $request
     * @param Member        $member
     * @param MemberRequest $memberRequest
     * @return Response
     */
    public function update(Request $request, Member $member, MemberRequest $memberRequest)
    {
        // @todo, this only saves auth id
        $memberRequest->auth_id = $request['auth_id'];
        $memberRequest->save();

        return new RequestResource($memberRequest);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Member        $member
     * @param MemberRequest $memberRequest
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Member $member, MemberRequest $memberRequest)
    {
        abort_if($member->memberRequests()->whereIn('id', [$memberRequest->id])->count() == 0, 404, 'bad-relation');

        $memberRequest->delete();

        return response()->json(['message' => 'ok']);
    }
}
