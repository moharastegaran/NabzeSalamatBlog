<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Wipe and re-seed cleanly
        \DB::table('role_has_permissions')->delete();
        \DB::table('model_has_roles')->delete();
        \DB::table('model_has_permissions')->delete();
        Role::query()->delete();
        Permission::query()->delete();

        $permissions = [
            'users.create', 'users.edit', 'users.delete',
            'tickets.assign', 'tickets.close', 'tickets.respond',
            'blog.create', 'blog.edit', 'blog.delete', 'blog.instagram',
            'blog_categories.create', 'blog_categories.edit', 'blog_categories.delete',
            'tags.create', 'tags.delete',
            'comments.approve', 'comments.discard',
            'announcements.manage',
            'attachments.add', 'attachments.edit', 'attachments.delete',
            'roles.manage',
            'maintenance.manage',
            'reporting.get',
        ];

        foreach ($permissions as $name) {
            Permission::create(['name' => $name]);
        }

        $adminPermissions = array_values(array_filter(
            $permissions,
            fn (string $name) => $name !== 'blog.instagram'
        ));

        $admin = Role::create(['name' => 'مدیر کل', 'slug' => 'admin', 'guard_name' => 'web']);
        $admin->givePermissionTo($adminPermissions);

        $supadmin = Role::create(['name' => 'سوپرادمین', 'slug' => 'supadmin', 'guard_name' => 'web']);
        $supadmin->givePermissionTo($permissions);

        $contributor = Role::create(['name' => 'همکار محتوا', 'slug' => 'contributor', 'guard_name' => 'web']);
        $contributor->givePermissionTo([
            'blog.create', 'blog.edit', 'blog.delete',
            'blog_categories.create', 'blog_categories.edit', 'blog_categories.delete',
            'tags.create', 'tags.delete',
            'comments.approve', 'comments.discard',
        ]);

        $writer = Role::create(['name' => 'نویسنده', 'slug' => 'writer', 'guard_name' => 'web']);
        $writer->givePermissionTo([
            'blog.create', 'blog.edit', 'blog.delete',
        ]);
    }
}
