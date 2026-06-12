<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['users.create', 'users.edit', 'users.delete']);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('users.create');
    }

    public function update(User $user, User $target): bool
    {
        return $user->hasPermissionTo('users.edit');
    }

    public function suspend(User $user, User $target): bool
    {
        return $user->hasPermissionTo('users.edit');
    }

    public function delete(User $user, User $target): bool
    {
        return $user->hasPermissionTo('users.delete') && $user->id !== $target->id;
    }
}
