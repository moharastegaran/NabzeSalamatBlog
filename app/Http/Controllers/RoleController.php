<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with('permissions')->get()->map(fn ($role) => [
            'id'          => $role->id,
            'name'        => $role->label,
            'slug'        => $role->slug,
            'permissions' => $role->permissions->pluck('name')->toArray(),
        ]);

        return Inertia::render('Roles/Index', [
            'roles'       => $roles,
            'permissions' => Permission::all()->pluck('name')->toArray(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:128',
            'slug'          => 'required|string|max:64|unique:roles,slug|alpha_dash',
            'permissions'   => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name'], 'slug' => $validated['slug'], 'guard_name' => 'web']);
        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return back()->with('success', 'نقش با موفقیت ایجاد شد.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => 'sometimes|string|max:128',
            'permissions'   => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if (!empty($validated['name'])) {
            $role->forceFill(['name' => $validated['name']])->save();
        }

        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'دسترسی‌های نقش به‌روز شد.');
    }

    public function rename(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:128',
            'slug' => ['required', 'string', 'max:64', 'alpha_dash', Rule::unique('roles', 'slug')->ignore($role->id)],
        ]);

        $role->forceFill(['name' => $validated['name'], 'slug' => $validated['slug']])->save();

        return back()->with('success', 'نقش با موفقیت تغییر نام یافت.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->slug, ['admin', 'supadmin', 'contributor', 'writer'], true)) {
            return back()->with('error', 'نقش‌های اصلی سیستم قابل حذف نیستند.');
        }

        $role->delete();

        return back()->with('success', 'نقش با موفقیت حذف شد.');
    }
}
