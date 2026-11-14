<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::with(['roles', 'city'])
            ->when(request('search'), fn ($q) => $q->where('name', 'like', '%' . request('search') . '%'))
            ->when(request('city_id'), fn ($q) => $q->where('city_id', request('city_id')))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users'       => $users,
            'filters'     => request()->only(['search', 'city_id']),
            'active_city' => request('city_id')
                ? \App\Models\City::find(request('city_id'))?->name
                : null,
            'roles' => Role::orderBy('name')->get()->map(fn ($r) => ['slug' => $r->slug, 'name' => $r->label]),
            'can' => [
                'create' => auth()->user()->can('create', User::class),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        $allowedRoles = Role::orderBy('name')->get()->map(fn ($r) => ['slug' => $r->slug, 'name' => $r->label])->toArray();

        return Inertia::render('Users/Create', [
            'allowedRoles' => $allowedRoles,
            'provinces'    => Province::with('cities')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $allowedRoles = Role::orderBy('name')->get()->map(fn ($r) => ['slug' => $r->slug, 'name' => $r->label])->toArray();
        $allowedSlugs = array_column($allowedRoles, 'slug');

        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'unique:users,email'],
            'mobile'        => ['nullable', 'string', 'max:20'],
            'melli_code'    => ['nullable', 'digits:10', 'unique:users,melli_code'],
            'profile_image' => ['nullable', 'string', 'max:500'],
            'bio'           => ['nullable', 'string'],
            'city_id'       => ['nullable', 'exists:cities,id'],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'role'          => ['required', 'string', 'in:' . implode(',', $allowedSlugs)],
        ]);

        $user = User::create([
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'mobile'        => $validated['mobile'] ?? null,
            'melli_code'    => $validated['melli_code'] ?? null,
            'profile_image' => $validated['profile_image'] ?: null,
            'bio'           => $validated['bio'] ?: null,
            'city_id'       => $validated['city_id'] ?? null,
            'password'      => bcrypt($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')->with('success', "کاربر \"{$user->name}\" با موفقیت ایجاد شد.");
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        $allowedRoles = Role::orderBy('name')->get()->map(fn ($r) => ['slug' => $r->slug, 'name' => $r->label])->toArray();

        $user->loadMissing('city');

        return Inertia::render('Users/Edit', [
            'editUser' => [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'mobile'        => $user->mobile,
                'melli_code'    => $user->melli_code,
                'profile_image' => $user->profile_image,
                'bio'           => $user->bio,
                'city_id'       => $user->city_id,
                'province_id'   => $user->city?->province_id,
            ],
            'currentRole'  => $user->roles->first()?->name ?? '',
            'allowedRoles' => $allowedRoles,
            'provinces'    => Province::with('cities')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $allowedRoles = Role::orderBy('name')->get()->map(fn ($r) => ['slug' => $r->slug, 'name' => $r->label])->toArray();
        $allowedSlugs = array_column($allowedRoles, 'slug');

        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'mobile'        => ['nullable', 'string', 'max:20'],
            'melli_code'    => ['nullable', 'digits:10', Rule::unique('users', 'melli_code')->ignore($user->id)],
            'profile_image' => ['nullable', 'string', 'max:500'],
            'bio'           => ['nullable', 'string'],
            'city_id'       => ['nullable', 'exists:cities,id'],
            'password'      => ['nullable', 'string', 'min:8', 'confirmed'],
            'role'          => ['required', 'string', 'in:' . implode(',', $allowedSlugs)],
        ]);

        $user->update([
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'mobile'        => $validated['mobile'] ?? null,
            'melli_code'    => $validated['melli_code'] ?? null,
            'profile_image' => $validated['profile_image'] ?: null,
            'bio'           => $validated['bio'] ?: null,
            'city_id'       => $validated['city_id'] ?? null,
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => bcrypt($validated['password'])]);
        }

        $user->syncRoles([$validated['role']]);

        return redirect()->route('users.index')->with('success', "اطلاعات کاربر \"{$user->name}\" با موفقیت ویرایش شد.");
    }

    public function suspend(User $user): RedirectResponse
    {
        $this->authorize('suspend', $user);

        $user->update(['is_suspended' => !$user->is_suspended]);

        return back()->with('success', $user->is_suspended ? 'User suspended.' : 'User reactivated.');
    }

    public function resetPassword(User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $newPassword = Str::random(10);
        $user->update(['password' => bcrypt($newPassword)]);

        return back()->with('password', $newPassword);
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);
        $username= $user->name;

        $user->delete();

        return back()->with('success', 'کاربر $username حذف شد');
    }
}
