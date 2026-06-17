<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
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

        $categories = BlogCategory::withCount(['posts' => fn ($q) => $q->published()])
            ->having('posts_count', '>', 0)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Front/Blog/Index', [
            'posts'          => $posts,
            'categories'     => $categories,
            'filters'        => [
                'category' => $categorySlug,
                'search'   => $search,
                'sort'     => $sort,
            ],
        ]);
    }

    public function category(string $slug): Response
    {
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
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Front/Blog/Category', [
            'category' => $category,
            'posts'    => $posts,
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

    public function show(string $slug): Response
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->with([
                'author:id,name',
                'category:id,name,slug',
                'tags:id,name,slug',
                'approvedComments' => fn ($q) => $q->latest(),
            ])
            ->firstOrFail();

        $post->increment('views');

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
        ]);
    }
}
