<?php

namespace App\Jobs\Admin;

use App\Models\User;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserCreateJob
{
    use Dispatchable;

    protected $data;
    protected $type;
    protected $user;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(FormRequest $request, $type)
    {
        $this->data = $request->validated();
        $this->type = $type;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // create the base user
        $this->createUser();
        // add the relationship for the user type
        switch ($this->type) {
            case 'ClinicalServicesUser':
                $this->user->clinicalServicesUser()->create($this->data);
            break;
        }
    }

    public function getUser()
    {
        return $this->user;
    }

    protected function createUser()
    {
        // @todo move user creation to a service
        // generate a password if not present
        if (empty($this->data['password'])) {
            $this->data['password'] = Str::random(16);
        }
        $this->user = User::create([
            'first_name'   => $this->data['first_name'],
            'last_name'    => $this->data['last_name'],
            'email'        => $this->data['email'],
            'password'     => Hash::make($this->data['password']),
            'primary_role' => $this->data['primary_role'],
            'user_type'    => 3,
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
    }
}
