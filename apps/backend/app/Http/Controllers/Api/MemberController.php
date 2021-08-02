<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberLookupRequest;
use App\Http\Requests\MemberRequest;
use App\Http\Resources\MemberResource;
use App\Jobs\MemberUpdateJob;
use App\Models\Member;
use App\Models\Payer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class MemberController extends Controller
{
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
    public function store(MemberRequest $request)
    {
        // the validation is already ran due to the magic of service binding, this is just retrieving the data
        $data = $request->validated();
        $member = Member::create([
            'name_title'         => $data['title'],
            'first_name'         => $data['first_name'],
            'last_name'          => $data['last_name'],
            'dob'                => $data['dob'],
            'gender'             => $data['gender'],
            'member_number'      => $data['member_number'],
            'member_number_type' => $data['member_number_type'],
            'payer_id'           => Payer::firstWhere('uuid', $data['plan'])->id,
            'lob_id'             => $data['line_of_business'],
            'language'           => $data['language'],
        ]);
        // contacts
        $member->addContacts($data['contacts']);
        // address
        $member->addresses()->create([
            'address_1'   => $data['address_1'],
            'address_2'   => empty($data['address_2']) ? '' : $data['address_2'],
            'city'        => $data['city'],
            'state'       => $data['state'],
            'county'      => $data['county'],
            'postal_code' => $data['postal_code'],
            'is_primary'  => 1,
        ]);

        return new MemberResource($member);
    }

    /**
     * Display the specified resource.
     *
     * @param Member $member
     * @return Response
     */
    public function show(Member $member)
    {
        return new MemberResource($member);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Member $member
     * @return Response
     */
    public function edit(Member $member)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Member  $member
     * @return Response
     */
    public function update(MemberRequest $request, Member $member)
    {
        dispatch(new MemberUpdateJob($request, $member));

        return new MemberResource($member);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Member $member
     * @return Response
     */
    public function destroy(Member $member)
    {
        //
    }

    /**
     * Search for members.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function search(MemberLookupRequest $request)
    {
        $members = Member::searchMembers()->paginate(request('perPage', 50));
        // dd($members->toSql(), $members->getBindings(), $members->get());

        return MemberResource::collection($members);
    }
}
