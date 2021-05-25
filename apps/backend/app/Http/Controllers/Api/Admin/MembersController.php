<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;
use App\Http\Resources\MemberResource;
use App\Models\Member;
use DB;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MembersController extends Controller
{
    public function duplicates(Request $request)
    {
        $data = Member::query()
            ->join(DB::raw('members m2'), function ($q) {
                $q->where('members.id', '<>', DB::raw('m2.id'))
                    ->where(DB::raw('m2.first_name'), 'like', DB::raw('members.first_name'))
                    ->where(DB::raw('m2.first_name'), 'like', DB::raw('members.first_name'));
            })

            // TODO Maybe only look like month and year instead of the day.
            ->where(DB::raw('m2.dob'), DB::raw('members.dob'))
            ->groupBy(DB::raw('members.uuid'))
            ->paginate($request->get('perPage', 50));

        return MemberResource::collection($data);
    }

    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $data = Member::paginate($request->get('perPage', 50));

        return MemberResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function store(MemberRequest $request)
    {
        $member = Member::create($request->validated());

        return new MemberResource($member);
    }

    /**
     * Display the specified resource.
     *
     * @param Member $member
     * @return AnonymousResourceCollection
     */
    public function show(Member $member)
    {
        return new MemberResource($member);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Member  $member
     * @return AnonymousResourceCollection
     */
    public function update(MemberRequest $request, Member $member)
    {
        $member->update($request->validated());

        return new MemberResource($member);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Member $member
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Member $member)
    {
        $member->delete();

        return response()->json(['message' => 'ok']);
    }
}
