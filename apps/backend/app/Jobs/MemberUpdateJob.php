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
    protected $isRunHistory = false;

    /**
     * Create a new job instance.
     *
     * @note add typehint when php is upgraded to 8.x MemberRequest | array $request
     *
     * @return void
     */
    public function __construct(MemberRequest | array $request, Member $member)
    {
        $this->data = $request instanceof MemberRequest ? $request->validated() : $request;
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
        // change other stuff
        if (isset($this->data['language_id']) || isset($this->data['dob']) || isset($this->data['gender'])) {
            $this->updateMemberData();
        }

        // if any record changes require adding member history
        if ($this->isRunHistory) {
            dispatch(new MemberPayerHistoryAddJob($this->member));
        }

    }

    protected function updateAddress()
    {
        $address = [
            'address_1'   => $this->data['address_1'],
            'address_2'   => $this->data['address_2'] ?? '',
            'city'        => $this->data['city'],
            'state'       => $this->data['state'],
            'county'      => $this->data['county'],
            'postal_code' => $this->data['postal_code'],
            'is_primary'  => true,
        ];
        // see if the current address has the same values
        $check = array_intersect_assoc($this->member->address->toArray(), $address);
        if ($check == $address) {
            return; // the address was not updated
        }
        // get primary address and set to non-primary
        $this->member->addresses
            ->filter(fn ($address) => $address->is_primary)
            ->each(fn ($address)   => $address->update(['is_primary' => false]));
        // add new primary address
        $this->member->addresses()->create($address);
        // refresh relationship
        $this->member->load('addresses');
    }

    protected function updatePhone()
    {
        // do not update if the same
        if ($this->member->mainPhone && $this->data['phone'] === $this->member->mainPhone->number) {
            return;
        }
        // get primary phone and set to non-primary
        $this->member->phones
            ->filter(fn ($phone) => $phone->is_primary)
            ->each(fn ($phone)   => $phone->update(['is_primary' => 0]));
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
        $this->isRunHistory = true;
    }

    protected function updateLob()
    {
        $this->member->update(['lob_id' => $this->data['line_of_business']]);
        // create a new member history record
        $this->isRunHistory = true;
    }

    protected function updateMemberNumber()
    {
        $this->member->update(['member_number' => $this->data['member_number']]);
        // create a new member history record
        $this->isRunHistory = true;
    }

    protected function updateMemberData()
    {
        foreach (['language_id', 'dob', 'gender'] as $field) {
            if (isset($this->data[$field]) && $this->data[$field] != $this->member->{$field}) {
                if ('dob' === $field && $this->member->dob->format('Y-m-d') === $this->data['dob']) {
                    continue;
                }

                $updated[$field] = $this->data[$field];
            }
        }

        if (!empty($updated)) {
            $this->member->update($updated);
        }
    }
}
