<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function landing(): Response
    {
        $recent = BlogPost::published()
            ->with('category:id,name,slug')
            ->select('id', 'title', 'slug', 'excerpt', 'featured_image', 'blog_category_id', 'published_at')
            ->latest('published_at')
            ->take(8)
            ->get();

        $postSelect = ['id', 'title', 'slug', 'featured_image', 'blog_category_id', 'published_at', 'views'];

        return Inertia::render('Front/Landing', [
            'sliderPosts'     => $recent->take(4)->values(),
            'suggestionPosts' => $recent->skip(4)->values(),
            'trendingPosts'   => BlogPost::published()
                ->with('category:id,name,slug')
                ->select($postSelect)
                ->orderByDesc('views')
                ->take(5)
                ->get(),
            'recentPosts'     => BlogPost::published()
                ->with('category:id,name,slug')
                ->select($postSelect)
                ->latest('published_at')
                ->take(5)
                ->get(),
            'analyzePosts'    => BlogPost::published()
                ->with('category:id,name,slug')
                ->select($postSelect)
                ->orderByRaw('LENGTH(body) DESC')
                ->take(5)
                ->get(),
            'tags'            => BlogTag::withCount('posts')
                ->orderByDesc('posts_count')
                ->get(['id', 'name', 'slug']),
            'videoPosts'      => BlogPost::published()
                ->with('category:id,name,slug')
                ->select('id', 'title', 'slug', 'excerpt', 'featured_image', 'video_url', 'blog_category_id', 'published_at', 'views')
                ->latest('published_at')
                ->take(8)
                ->get(),
            'audioPosts'      => BlogPost::published()
                ->whereHas('categories', fn ($q) => $q->whereIn('blog_categories.slug', ['nbd-sda', 'padkst', 'fayl-soty']))
                ->with([
                    'categories:id,name,slug',
                    'media' => fn ($q) => $q->where('collection_name', 'audio')->orderBy('order_column'),
                ])
                ->select('id', 'title', 'slug', 'excerpt', 'featured_image', 'blog_category_id', 'published_at', 'views')
                ->latest('published_at')
                ->take(2)
                ->get(),
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('Front/Index', [
            'products'     => [],
            'categories'   => [],
            'filters'      => [],
            'priceMin'     => 0,
            'priceMax'     => 0,
            'colorOptions' => [],
            'cartCount'    => $this->cartCount(),
        ]);
    }

    public function show(): Response
    {
        abort(404);
    }

    public function search(): JsonResponse
    {
        return response()->json([]);
    }

    public function aboutUs(): Response
    {
        return Inertia::render('Front/AboutUs', [
            'cartCount' => $this->cartCount(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Front/Contact', [
            'cartCount' => $this->cartCount(),
        ]);
    }

    public function gallery(): Response
    {
        $items = \App\Models\GalleryItem::with('city:id,name')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Front/Gallery', [
            'items'     => $items,
            'cartCount' => $this->cartCount(),
        ]);
    }

    private function cartCount(): int
    {
        return (int) collect(session('cart', []))->sum('quantity');
    }
}
