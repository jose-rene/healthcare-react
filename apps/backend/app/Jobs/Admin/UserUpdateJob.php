<?php

namespace App\Jobs\Admin;

use App\Models\User;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Http\FormRequest;

class UserUpdateJob
{
    use Dispatchable;

    protected $data;
    protected $type;
    protected $user;
    protected $userFields = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'primary_role',
    ];

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(FormRequest $request, User $user, $type)
    {
        $this->data = $request->validated();
        $this->type = $type;
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // update the base user
        $this->updateUser();
        // update the relationship for the user type
        switch ($this->type) {
            case 'ClinicalServicesUser':
                $this->user->clinicalServicesUser()->update($this->getUserTypeData());
            break;
        }
    }

    /**
     * Get the validated data that is not for the user model.
     *
     * @return array
     */
    protected function getUserTypeData()
    {
        return collect($this->data)->except($this->userFields)->toArray();
    }

    /**
     * Update the user.
     *
     * @return void
     */
    protected function updateUser()
    {
        // add the primary role if necessary
        if ($this->user->isNotA($this->data['primary_role'])) {
            $this->user->assign($this->data['primary_role']);
        }
        // update the user
        $this->user->update([
            'first_name'   => $this->data['first_name'],
            'last_name'    => $this->data['last_name'],
            'email'        => $this->data['email'],
            'primary_role' => $this->data['primary_role'],
        ]);
        // add the phone number if updated
        if (!empty($this->data['phone']) && $this->data['phone'] !== $this->user->primary_phone) {
            $this->user->phones()->create(['number' => $this->data['phone'], 'is_primary' => 1, 'phoneable_type' => User::class, 'phoneable_id' => $this->user->id]);
        }
    }
}
