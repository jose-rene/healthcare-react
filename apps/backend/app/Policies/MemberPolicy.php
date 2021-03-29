<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MemberPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param User $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        if ($user->isA('software_engineer', 'hp_champion', 'hp_user')) {
            return true;
        }

        return $this->deny('You do not have permissions for the requested resource.');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User   $user
     * @param Member $member
     * @return mixed
     */
    public function view(User $user, Member $member)
    {
        if ($user->isA('software_engineer', 'hp_champion', 'hp_user')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        if ($user->isA('software_engineer', 'hp_champion', 'hp_user')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User   $user
     * @param Member $member
     * @return mixed
     */
    public function update(User $user, Member $member)
    {
        if ($user->isA('software_engineer', 'hp_champion', 'hp_user')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User   $user
     * @param Member $member
     * @return mixed
     */
    public function delete(User $user, Member $member)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param User   $user
     * @param Member $member
     * @return mixed
     */
    public function restore(User $user, Member $member)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param User   $user
     * @param Member $member
     * @return mixed
     */
    public function forceDelete(User $user, Member $member)
    {
        //
    }
}
