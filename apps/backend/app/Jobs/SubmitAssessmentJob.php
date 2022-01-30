<?php

namespace App\Jobs;

use App\Models\Request;
use App\Models\RequestStatus;
use App\Models\User;
use App\Notifications\SubmittedNotification;
use Carbon\Carbon;
use Illuminate\Foundation\Bus\Dispatchable;

class SubmitAssessmentJob
{
    use Dispatchable;

    protected $request;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->request->requestDates()->create([
            'request_date_type_id' => 1,
            'date'                 => Carbon::now(),
        ]);
        $submitted = RequestStatus::slug('submitted')->first();
        $this->request->requestStatus()->associate($submitted)->save();
        // send notification to reviewer
        $notification = new SubmittedNotification($this->request);
        $users = User::where('primary_role', 'reviewer_manager')->get();
        if ($this->request->reviewer) {
            $users.push($this->request->reviewer);
        }

        if (!$users->count()) {
            // nothing to do
            return;
        }

        $users->each(fn($reviewer) => $reviewer->notify($notification));

    }
}
