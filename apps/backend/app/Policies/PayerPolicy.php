<?php

namespace App\Policies;

use App\Models\Payer;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PayerPolicy
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
        return $user->can('view-payers') || $user->can('create-payers');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User  $user
     * @param Payer $payer
     * @return mixed
     */
    public function view(User $user, Payer $payer)
    {
        // check ability
        if (!$user->can('view-payers') && !$user->can('create-payers')) {
            return false;
        }
        // healthplan users must be associated with a payer
        if (2 === $user->user_type && !$user->payer) {
            return false;
        }
        // check payer restrictions
        if ($user->payer) {
            // check parent payer
            if ($user->payer->id === $payer->id) {
                return true;
            }
            // check child payers
            if (!$user->payer->payers) {
                return false;
            }
            $payerIds = $user->payer->payers->flatten()->pluck('id')->toArray();

            return in_array($payer->id, $payerIds);
        }
        // another user type with view-payer ability
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @return mixed
     */
    public function profile(User $user)
    {
        return 2 === $user->user_type;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('create-payers');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User  $user
     * @param Payer $payer
     * @return mixed
     */
    public function update(User $user, Payer $payer)
    {
        return $user->can('create-payers', $payer);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User  $user
     * @param Payer $payer
     * @return mixed
     */
    public function delete(User $user, Payer $payer)
    {
        return $user->can('create-payers', $payer);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param User  $user
     * @param Payer $payer
     * @return mixed
     */
    public function restore(User $user, Payer $payer)
    {
        return $user->can('create-payers', $payer);
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param User  $user
     * @param Payer $payer
     * @return mixed
     */
    public function forceDelete(User $user, Payer $payer)
    {
        return $user->can('force-delete-payers', $payer);
    }
}
