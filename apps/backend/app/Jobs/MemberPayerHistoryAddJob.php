<?php

namespace App\Jobs;

use App\Models\Member;
use Illuminate\Foundation\Bus\Dispatchable;

class MemberPayerHistoryAddJob
{
    use Dispatchable;

    protected $member;

    /**
     * Create a new job instance.
     *
     * @param Member $member
     */
    public function __construct(Member $member)
    {
        $this->member = $member;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->member->lob) {
            $this->member->history()->create([
                'payer_id'           => $this->member->payer->id,
                'lob_id'             => $this->member->lob->id,
                'member_number'      => $this->member->member_number,
                'member_number_type' => $this->member->member_number_type,
            ]);
        }
    }
}
