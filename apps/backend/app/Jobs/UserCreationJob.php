<?php

namespace App\Jobs;

use App\Models\Payer;
use App\Models\User;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserCreationJob
{
    use Dispatchable;

    protected $data;
    protected $user;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // generate a password if not present
        if (empty($this->data['password'])) {
            $this->data['password'] = Str::random(16);
        }
        // get the user type creating the user
        $authedUser = auth()->user();
        // get the payer for healthplan users
        if (2 === $this->data['user_type']) {
            // get the payer of the healthplan user
            if ('HealthPlanUser' === $authedUser->user_type_name) {
                $payer = $authedUser->healthplanUser->payer->first();
            }
            else {
                $payer = Payer::firstWhere('uuid', $this->data['payer_id'] ?? '');
            }
            if (!$payer) {
                throw new HttpResponseException(response()->json(['errors' => ['payer_id' => ['Invalid Payer']]], 422));
            }
        }
        $this->user = User::create([
            'first_name'   => $this->data['first_name'],
            'last_name'    => $this->data['last_name'],
            'email'        => $this->data['email'],
            'password'     => Hash::make($this->data['password']),
            'primary_role' => $this->data['primary_role'],
            'user_type'    => $this->data['user_type'],
        ]);
        // add the phone number
        if (!empty($this->data['phone'])) {
            $this->user->phones()->create(['number' => $this->data['phone'], 'is_primary' => 1, 'phoneable_type' => User::class, 'phoneable_id' => $this->user->id]);
        }

        // send validation email if requested in form
        if (!empty($this->data['send_verification'])) {
            $this->user->sendEmailVerificationNotification();
        } else {
            $this->user->markEmailAsVerified();
        }

        // add the primary role
        $this->user->assign($this->data['primary_role']);
        // sync the user type, creates user type relation if null
        $this->userType = $this->user->syncUserType();
        if ('HealthPlanUser' === $this->user->user_type_name) {
            // healthplan specific field
            if (!empty($this->data['job_title'])) {
                $this->userType->job_title = $this->data['job_title'];
            }
            // set company relationship in user type
            $this->userType->payer()->associate($payer);
            $this->userType->save();
            // permissions
            if (!empty($this->data['can_view_reports'])) {
                $this->user->allow('view-reports');
            }
            if (!empty($this->data['can_view_invoices'])) {
                $this->user->allow('view-invoices');
            }
            if (!empty($this->data['can_create_users'])) {
                $this->user->allow('create-users');
            }
        }

        $this->user->save();
    }

    public function getUser()
    {
        return $this->user;
    }
}
