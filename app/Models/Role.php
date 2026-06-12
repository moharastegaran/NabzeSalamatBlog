<?php

namespace App\Models;

use Spatie\Permission\Exceptions\RoleDoesNotExist;
use Spatie\Permission\Guard;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $fillable = ['name', 'slug', 'guard_name'];

    /**
     * Spatie's HasRoles trait calls $role->name everywhere (hasRole, getRoleNames, etc.)
     * We proxy it to the slug column so internal checks like ->contains('name', 'admin') still work.
     */
    public function getNameAttribute(): string
    {
        return $this->attributes['slug'] ?? '';
    }

    /**
     * The human-readable display name stored in the DB 'name' column.
     */
    public function getLabelAttribute(): string
    {
        return $this->attributes['name'] ?? $this->attributes['slug'] ?? '';
    }

    public static function findByName(string $name, string|null $guardName = null): self
    {
        $guardName = $guardName ?? Guard::getDefaultName(static::class);

        $role = static::where('slug', $name)->where('guard_name', $guardName)->first();

        if (! $role) {
            throw RoleDoesNotExist::named($name);
        }

        return $role;
    }

    public static function findOrCreate(string $name, string|null $guardName = null): self
    {
        $guardName = $guardName ?? Guard::getDefaultName(static::class);

        $role = static::where('slug', $name)->where('guard_name', $guardName)->first();

        if (! $role) {
            return static::query()->create(['slug' => $name, 'guard_name' => $guardName]);
        }

        return $role;
    }
}
