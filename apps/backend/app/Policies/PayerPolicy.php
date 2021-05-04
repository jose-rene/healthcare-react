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
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Payer  $payer
     * @return mixed
     */
    public function view(User $user, Payer $payer)
    {
        // check ability
        if (!$user->can('view-payers')) {
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
            $payerIds = $user->payer->payers->flatten()->pluck('id');

            return in_array($payer->id, $payerIds);
        }
        // another user type with view-payer ability
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function profile(User $user)
    {
        return 2 === $user->user_type;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        // @todo create a create-payers ability and apply to roles, then only check ability
        return $user->isa('software_engineer', 'hp_user', 'hp_champion');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Payer  $payer
     * @return mixed
     */
    public function update(User $user, Payer $payer)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Payer  $payer
     * @return mixed
     */
    public function delete(User $user, Payer $payer)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Payer  $payer
     * @return mixed
     */
    public function restore(User $user, Payer $payer)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Payer  $payer
     * @return mixed
     */
    public function forceDelete(User $user, Payer $payer)
    {
        //
    }
}
