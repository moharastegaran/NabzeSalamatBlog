<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasRole('customer')) {
            return redirect()->route('customer.panel');
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'users'           => $user->hasPermissionTo('users.edit') ? (function () {
                    $byRole = DB::table('model_has_roles')
                        ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                        ->where('model_has_roles.model_type', User::class)
                        ->selectRaw('roles.slug, count(*) as total')
                        ->groupBy('roles.slug')
                        ->pluck('total', 'slug');
                    return ['total' => (int) $byRole->sum(), 'by_role' => $byRole];
                })() : null,
                'published_posts' => $user->hasPermissionTo('blog.create') ? BlogPost::published()->count() : null,
                'blog_categories' => $user->hasPermissionTo('blog.create') ? BlogCategory::count() : null,
                'assets'          => $user->hasPermissionTo('attachments.add') ? (function () {
                    $byType = Asset::selectRaw('type, count(*) as total')->groupBy('type')->pluck('total', 'type');
                    return ['total' => $byType->sum(), 'by_type' => $byType];
                })() : null,
            ],
            'profile' => [
                'mobile' => $user->mobile,
            ],
            'recent_posts' => $user->hasPermissionTo('blog.create')
                ? BlogPost::where('author_id', $user->id)
                    ->latest()
                    ->limit(5)
                    ->get(['id', 'title', 'slug', 'status', 'published_at', 'created_at'])
                : null,
            'roles'      => Role::orderBy('name')->get()->map(fn ($r) => ['slug' => $r->slug, 'name' => $r->label]),
            'range'      => request('range', 'monthly'),
            'chart_data' => ['labels' => [], 'series' => []],
        ]);
    }
}
