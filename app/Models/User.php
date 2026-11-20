<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;
    use HasRoles {
        hasRole as protected spatieHasRole;
    }

    protected $fillable = [
        'name',
        'email',
        'mobile',
        'melli_code',
        'profile_image',
        'bio',
        'city_id',
        'password',
        'is_suspended',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'string',
            'is_suspended'      => 'boolean',
        ];
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(\App\Models\BlogPost::class, 'author_id');
    }

    /**
     * Supadmin inherits every check that targets the admin role.
     */
    public function hasRole($roles, ?string $guard = null): bool
    {
        if ($this->getRoleNames()->contains('supadmin') && $this->roleCheckIncludesAdmin($roles)) {
            return true;
        }

        return $this->spatieHasRole($roles, $guard);
    }

    /**
     * @param  string|int|array|Role|\Illuminate\Support\Collection|\BackedEnum  $roles
     */
    private function roleCheckIncludesAdmin(mixed $roles): bool
    {
        if (is_string($roles)) {
            if (str_contains($roles, '|')) {
                foreach (explode('|', $roles) as $role) {
                    if (trim($role) === 'admin') {
                        return true;
                    }
                }

                return false;
            }

            return $roles === 'admin';
        }

        if ($roles instanceof Role) {
            return $roles->name === 'admin';
        }

        if ($roles instanceof \BackedEnum) {
            return $roles->value === 'admin';
        }

        if ($roles instanceof \Illuminate\Support\Collection) {
            return $roles->contains(fn ($role) => $this->roleCheckIncludesAdmin($role));
        }

        if (is_array($roles)) {
            foreach ($roles as $role) {
                if ($this->roleCheckIncludesAdmin($role)) {
                    return true;
                }
            }
        }

        return false;
    }
}
