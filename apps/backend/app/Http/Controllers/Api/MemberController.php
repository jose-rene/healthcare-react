<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberLookupRequest;
use App\Http\Requests\MemberRequest;
use App\Http\Resources\MemberResource;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
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
    public function store(MemberRequest $request)
    {
        // the validation is already ran due to the magic of service binding, this is just retrieving the data
        $data = $request->validated();
        $member = Member::create([
            'name_title'       => $data['title'],
            'first_name'       => $data['first_name'],
            'last_name'        => $data['last_name'],
            'dob'              => $data['dob'],
            'gender'           => $data['gender'],
            'member_number'    => $data['member_number'],
            'member_id_type'   => $data['member_id_type'],
            'line_of_business' => $data['line_of_business'],
            'payer_id'         => $data['plan'],
            'language'         => $data['language'],
        ]);
        // @todo add emailable model and contact types model
        foreach ($data['contacts'] as $index => $item) {
            if (!strstr($item['value'], '@')) {
                $member->phones()->create(['number' => $item['value'], 'is_primary' => 0 === $index ? 1 : 0, 'phoneable_type' => Member::class, 'phoneable_id' => $member->id]);
            }
        }
        // address
        $member->addresses()->create([
            'address_1'   => $data['address_1'],
            'address_2'   => $data['address_2'],
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
     * @param  \App\Models\Member  $member
     * @return \Illuminate\Http\Response
     */
    public function show(Member $member)
    {
        return new MemberResource($member);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Member  $member
     * @return \Illuminate\Http\Response
     */
    public function edit(Member $member)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Member  $member
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Member $member)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Member  $member
     * @return \Illuminate\Http\Response
     */
    public function destroy(Member $member)
    {
        //
    }

    /**
     * Search for members.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(MemberLookupRequest $request)
    {
        $members = Member::searchMembers()->paginate(request('perPage', 50));
        // dd($members->toSql(), $members->getBindings(), $members->get());

        return MemberResource::collection($members);
    }
}
