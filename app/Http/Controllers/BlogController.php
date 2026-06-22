<?php

namespace App\Http\Controllers;

use App\Models\AdBanner;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use App\Services\PostViewTracker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(private PostViewTracker $viewTracker) {}

    private function mostRead(int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return BlogPost::published()
            ->mostRead('week')
            ->select('id', 'title', 'slug', 'featured_image', 'published_at', 'views')
            ->limit($limit)
            ->get();
    }

    public function index(Request $request): Response
    {
        $categorySlug = $request->query('category');
        $search       = $request->query('search');
        $sort         = $request->query('sort', 'newest');

        $query = BlogPost::published()
            ->with(['author:id,name', 'category:id,name,slug', 'tags:id,name,slug'])
            ->withCount('approvedComments')
            ->when($categorySlug, fn ($q) => $q->whereHas('category', fn ($q) => $q->where('slug', $categorySlug)))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhereHas('tags', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                      ->orWhereHas('category', fn ($q) => $q->where('name', 'like', "%{$search}%"));
                });
            });

        match ($sort) {
            'oldest'      => $query->oldest('published_at'),
            'most_viewed' => $query->orderByDesc('views'),
            default       => $query->latest('published_at'),
        };

        $posts = $query->paginate(8)->withQueryString();

        $categories = BlogCategory::whereNull('parent_id')
            ->with(['children' => fn ($q) => $q
                ->withCount(['posts' => fn ($q) => $q->published()])
                ->orderBy('name')
            ])
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->filter(fn ($cat) =>
                $cat->posts_count > 0 ||
                $cat->children->some(fn ($c) => ($c->posts_count ?? 0) > 0)
            )
            ->map(fn ($cat) => [
                'id'          => $cat->id,
                'name'        => $cat->name,
                'slug'        => $cat->slug,
                'posts_count' => $cat->posts_count,
                'children'    => $cat->children
                    ->filter(fn ($c) => ($c->posts_count ?? 0) > 0)
                    ->map(fn ($c) => [
                        'id'          => $c->id,
                        'name'        => $c->name,
                        'slug'        => $c->slug,
                        'posts_count' => $c->posts_count ?? 0,
                    ])
                    ->values(),
            ])
            ->values();

        return Inertia::render('Front/Blog/Index', [
            'posts'      => $posts,
            'categories' => $categories,
            'filters'    => [
                'category' => $categorySlug,
                'search'   => $search,
                'sort'     => $sort,
            ],
            'adBanners'  => AdBanner::activeForLocation('blog')->get(),
        ]);
    }

    public function category(Request $request, string $slug): Response
    {
        $search = trim($request->query('search', ''));

        $category = BlogCategory::where('slug', $slug)
            ->with([
                'parent:id,name,slug',
                'children' => fn ($q) => $q->withCount(['posts' => fn ($q) => $q->published()])->orderBy('name'),
            ])
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->firstOrFail();

        $posts = BlogPost::published()
            ->whereHas('categories', fn ($q) => $q->where('blog_categories.id', $category->id))
            ->with(['author:id,name', 'tags:id,name,slug'])
            ->withCount('approvedComments')
            ->when($search, fn ($q) => $q->where(fn ($q) => $q
                ->where('title',   'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%")
                ->orWhere('body',    'like', "%{$search}%")
            ))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        $recentPosts = BlogPost::published()
            ->latest('published_at')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'featured_image', 'published_at']);

        return Inertia::render('Front/Blog/Category', [
            'category'    => $category,
            'posts'       => $posts,
            'recentPosts' => $recentPosts,
            'mostRead'    => $this->mostRead(),
            'search'      => $search,
            'adBanners'   => AdBanner::activeForLocation('catarchive')->get(),
        ]);
    }

    public function tag(Request $request, string $slug): Response
    {
        $search = trim($request->query('search', ''));

        $tag = BlogTag::where('slug', $slug)
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->firstOrFail();

        $posts = BlogPost::published()
            ->whereHas('tags', fn ($q) => $q->where('blog_tags.slug', $slug))
            ->with(['author:id,name', 'category:id,name,slug', 'tags:id,name,slug'])
            ->withCount('approvedComments')
            ->when($search, fn ($q) => $q->where(fn ($q) => $q
                ->where('title',   'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%")
                ->orWhere('body',    'like', "%{$search}%")
            ))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        $recentPosts = BlogPost::published()
            ->latest('published_at')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'featured_image', 'published_at']);

        return Inertia::render('Front/Blog/Tag', [
            'tag'         => $tag,
            'posts'       => $posts,
            'recentPosts' => $recentPosts,
            'mostRead'    => $this->mostRead(),
            'search'      => $search,
            'adBanners'   => AdBanner::activeForLocation('catarchive')->get(),
        ]);
    }

    public function author(Request $request, int $id): Response
    {
        $author = \App\Models\User::findOrFail($id);

        $posts = BlogPost::published()
            ->where('author_id', $id)
            ->with(['category:id,name,slug', 'tags:id,name,slug'])
            ->withCount('approvedComments')
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        $recentPosts = BlogPost::published()
            ->latest('published_at')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'featured_image', 'published_at']);

        return Inertia::render('Front/Blog/Author', [
            'author'      => ['id' => $author->id, 'name' => $author->name],
            'posts'       => $posts,
            'recentPosts' => $recentPosts,
            'mostRead'    => $this->mostRead(),
            'adBanners'   => AdBanner::activeForLocation('catarchive')->get(),
        ]);
    }

    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        $q = trim($request->query('q', ''));
        if (strlen($q) < 2) return response()->json([]);

        $posts = BlogPost::published()
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                      ->orWhere('excerpt', 'like', "%{$q}%");
            })
            ->latest('published_at')
            ->limit(8)
            ->get(['id', 'title', 'slug', 'featured_image']);

        return response()->json($posts);
    }

    public function shortLink(string $code): \Illuminate\Http\RedirectResponse
    {
        $post = BlogPost::published()->where('short_link', $code)->firstOrFail();
        return redirect()->route('front.blog.show', $post->slug, 301);
    }

    public function show(Request $request, string $slug): Response
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->with([
                'author:id,name',
                'category:id,name,slug',
                'categories:id,name,slug',
                'tags:id,name,slug',
                'approvedComments' => fn ($q) => $q->latest(),
            ])
            ->firstOrFail();

        $post->append('time_to_read');

        $viewToken = $this->viewTracker->track($post->id, $request);

        $related = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->where('blog_category_id', $post->blog_category_id)
            ->with('author:id,name')
            ->latest('published_at')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'excerpt', 'featured_image', 'published_at', 'author_id', 'blog_category_id']);

        $recentPosts = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->latest('published_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'excerpt', 'featured_image', 'published_at']);

        return Inertia::render('Front/Blog/Show', [
            'post'        => $post,
            'related'     => $related,
            'recentPosts' => $recentPosts,
            'mostRead'    => $this->mostRead(),
            'adBanners'   => AdBanner::activeForLocation('blogsingle')->get(),
            'viewToken'   => $viewToken,
        ]);
    }
}
