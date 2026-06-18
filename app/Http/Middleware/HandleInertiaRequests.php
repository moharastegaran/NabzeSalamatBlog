<?php

namespace App\Http\Middleware;

use App\Models\BlogCategory;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'mobile'      => $user->mobile,
                    'roles'       => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'flash' => [
                'success'  => fn () => $request->session()->get('success'),
                'error'    => fn () => $request->session()->get('error'),
                'password' => fn () => $request->session()->get('password'),
            ],
            'shopMaintenance' => fn () => (bool) cache()->get('shop_maintenance', false),
            'openTickets'     => fn () => $user
                ? Ticket::whereNotNull('to_user_id')
                    ->where('to_user_id', $user->id)
                    ->where('status', 'open')
                    ->count()
                : 0,
            'navCategories'   => fn () => BlogCategory::whereNull('parent_id')
                ->with(['children' => fn ($q) => $q->select('id', 'name', 'slug', 'parent_id')->orderBy('name')])
                ->select('id', 'name', 'slug')
                ->orderBy('name')
                ->get(),
        ];
    }
}
