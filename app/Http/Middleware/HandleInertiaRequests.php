<?php

namespace App\Http\Middleware;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\ContactMessage;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        // SSR is for public front pages only — skip admin/auth panels.
        if (! $request->routeIs('front.*')) {
            config(['inertia.ssr.enabled' => false]);
        }

        $user = $request->user();

        return [
            ...parent::share($request),
            'app' => [
                'name'   => config('app.name', 'نبض سلامت'),
                'url'    => rtrim(config('app.url'), '/'),
                'locale' => 'fa_IR',
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
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
            'breakingNews'    => fn () => BlogPost::published()
                ->whereHas('categories', fn ($q) => $q->where(function ($q) {
                    $q->where('blog_categories.id', 9)
                        ->orWhere('blog_categories.slug', 'breaking-news');
                }))
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->limit(20)
                ->get(['id', 'title', 'slug'])
                ->map(fn (BlogPost $post) => [
                    'id'    => $post->id,
                    'title' => $post->title,
                    'url'   => route('front.blog.show', $post->slug, absolute: false),
                ])
                ->values(),
            'contactUnread'   => fn () => $user && in_array('admin', $user->getRoleNames()->toArray())
                ? ContactMessage::whereNull('read_at')->count()
                : 0,
            'navCategories'   => fn () => BlogCategory::whereNull('parent_id')
                ->with(['children' => fn ($q) => $q->select('id', 'name', 'slug', 'parent_id')->orderBy('name')])
                ->select('id', 'name', 'slug', 'icon', 'thumbnail')
                ->orderBy('id')
                ->get(),
            'advertiseModal'  => function () {
                try {
                    $page = \App\Models\PageContent::forSlug('advertise-modal');

                    return $page->content ?: \App\Models\PageContent::advertiseModalDefaults();
                } catch (\Throwable) {
                    return \App\Models\PageContent::advertiseModalDefaults();
                }
            },
            'footerQuickLinks' => function () {
                try {
                    $page = \App\Models\PageContent::forSlug('footer-quick-links');

                    return $page->content ?: \App\Models\PageContent::footerQuickLinksDefaults();
                } catch (\Throwable) {
                    return \App\Models\PageContent::footerQuickLinksDefaults();
                }
            },
            'footerBrand' => function () {
                try {
                    $page = \App\Models\PageContent::forSlug('footer-brand');

                    return $page->content ?: \App\Models\PageContent::footerBrandDefaults();
                } catch (\Throwable) {
                    return \App\Models\PageContent::footerBrandDefaults();
                }
            },
            'contactInfos' => function () {
                try {
                    $page = \App\Models\PageContent::forSlug('contact');
                    $content = $page->content ?: \App\Models\PageContent::contactDefaults();

                    return $content['contact_infos'] ?? \App\Models\PageContent::contactDefaults()['contact_infos'];
                } catch (\Throwable) {
                    return \App\Models\PageContent::contactDefaults()['contact_infos'];
                }
            },
        ];
    }
}
