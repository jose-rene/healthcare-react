<?php

namespace App\Jobs;

use App\Http\Requests\MemberRequest;
use App\Models\Member;
use App\Models\Payer;
use Illuminate\Foundation\Bus\Dispatchable;

class MemberUpdateJob
{
    use Dispatchable;

    protected $data;
    protected $member;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(MemberRequest $request, Member $member)
    {
        $this->data   = $request->validated();
        $this->member = $member;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if (isset($this->data['address_1'])) {
            $this->updateAddress();
        }
        if (isset($this->data['phone'])) {
            $this->updatePhone();
        }
        if (isset($this->data['plan'])) {
            $this->updatePayer();
        }
        if (isset($this->data['line_of_business'])) {
            $this->updateLob();
        }
        if (isset($this->data['member_number'])) {
            $this->updateMemberNumber();
        }
    }

    protected function updateAddress()
    {
        // get primary address and set to non-primary
        $this->member->addresses
            ->filter(fn($address) => $address->is_primary)
            ->each(fn($address) => $address->update(['is_primary' => 0]));
        // add new primary address
        $this->member->addresses()->create([
            'address_1'   => $this->data['address_1'],
            'address_2'   => $this->data['address_2'],
            'city'        => $this->data['city'],
            'state'       => $this->data['state'],
            'county'      => $this->data['county'],
            'postal_code' => $this->data['postal_code'],
            'is_primary'  => 1,
        ]);
        // refresh relationship
        $this->member->load('addresses');
    }

    protected function updatePhone()
    {
        // get primary phone and set to non-primary
        $this->member->phones
            ->filter(fn($phone) => $phone->is_primary)
            ->each(fn($phone) => $phone->update(['is_primary' => 0]));
        // add new primary phone contact
        $this->member->phones()->create([
            'number'         => $this->data['phone'],
            'is_primary'     => 1,
            'contact_type'   => 'Phone',
            'phoneable_type' => Member::class,
            'phoneable_id'   => $this->member->id,
        ]);
        // refresh relationship
        $this->member->load('phones');
    }

    protected function updatePayer()
    {
        $this->member->update([
            'payer_id' => Payer::firstWhere('uuid', $this->data['plan'])->id,
        ]);
        // create a new member history record
        dispatch(new MemberPayerHistoryAddJob($this->member));
    }

    protected function updateLob()
    {
        $this->member->update(['lob_id' => $this->data['line_of_business']]);
        // create a new member history record
        dispatch(new MemberPayerHistoryAddJob($this->member));
    }

    protected function updateMemberNumber()
    {
        $this->member->update(['member_number' => $this->data['member_number']]);
        // create a new member history record
        dispatch(new MemberPayerHistoryAddJob($this->member));
    }
}
