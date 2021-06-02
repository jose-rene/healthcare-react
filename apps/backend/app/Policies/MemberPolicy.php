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
        return $user->can('view-members') || $user->can('create-members');
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
        return $user->can('view-members') || $user->can('create-members');
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-members');
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
        return $user->can('create-members');
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
        return $user->can('create-members');
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
        return $user->can('create-members');
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
        return $user->can('force-delete-members');
    }
}
