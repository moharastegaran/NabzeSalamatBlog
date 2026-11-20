<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $instagram = Permission::findOrCreate('blog.instagram', 'web');

        $admin = Role::where('slug', 'admin')->where('guard_name', 'web')->first();

        $adminPermissionNames = $admin
            ? $admin->permissions()->pluck('name')->all()
            : Permission::query()
                ->where('guard_name', 'web')
                ->where('name', '!=', 'blog.instagram')
                ->pluck('name')
                ->all();

        $supadmin = Role::where('slug', 'supadmin')->where('guard_name', 'web')->first();

        if (! $supadmin) {
            $supadmin = Role::create([
                'name'       => 'سوپرادمین',
                'slug'       => 'supadmin',
                'guard_name' => 'web',
            ]);
        } else {
            $supadmin->forceFill(['name' => 'سوپرادمین'])->save();
        }

        $supadmin->syncPermissions(array_values(array_unique([
            ...$adminPermissionNames,
            $instagram->name,
        ])));

        // Keep Instagram generation exclusive to supadmin for now.
        if ($admin) {
            $admin->revokePermissionTo('blog.instagram');
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::where('slug', 'supadmin')->where('guard_name', 'web')->delete();
        Permission::where('name', 'blog.instagram')->where('guard_name', 'web')->delete();

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
