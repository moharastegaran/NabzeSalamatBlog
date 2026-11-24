<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use App\Models\PostMedia;
use App\Services\BaleService;
use App\Services\BlogPostBroadcastFormatter;
use App\Services\BlogPostPublisher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    public function index(Request $request): Response
    {
        $categoryId = $request->query('category');

        $search = trim((string) $request->query('search', ''));

        $categoryFilter = fn ($q) => $q->whereHas('categories', fn ($q) => $q->where('blog_categories.id', $categoryId));
        $searchFilter   = fn ($q) => $q->where(fn ($q) => $q
            ->where('title', 'like', "%{$search}%")
            ->orWhere('excerpt', 'like', "%{$search}%")
            ->orWhere('body', 'like', "%{$search}%")
        );

        $posts = BlogPost::with(['author', 'categories'])
            ->withCount('comments')
            ->when($categoryId, $categoryFilter)
            ->when($search, $searchFilter)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        if ($request->user()?->can('blog.instagram')) {
            $formatter = app(BlogPostBroadcastFormatter::class);

            $posts->getCollection()->transform(function (BlogPost $post) use ($formatter) {
                $post->setAttribute('caption_plain', $formatter->format($post));

                return $post;
            });
        }

        $statusCounts = BlogPost::when($categoryId, $categoryFilter)
            ->when($search, $searchFilter)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $activeCategory = $categoryId
            ? BlogCategory::find($categoryId, ['id', 'name', 'parent_id'])
            : null;

        return Inertia::render('Blog/Index', [
            'posts'          => $posts,
            'categories'     => BlogCategory::orderBy('name')->get(['id', 'name', 'parent_id']),
            'activeCategory' => $activeCategory,
            'statusCounts'   => $statusCounts,
            'filters'        => [
                'search'   => $search,
                'category' => $categoryId ? (int) $categoryId : null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Blog/Create', $this->formData());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePost($request);
        $validated['featured_image'] = $validated['featured_image'] ?: null;
        $categoryIds = $validated['category_ids'] ?? [];
        $tagIds      = $validated['tag_ids'] ?? [];
        unset($validated['category_ids'], $validated['tag_ids']);

        $status = $validated['status'];

        $post = BlogPost::create([
            ...$validated,
            'author_id'    => auth()->id(),
            'status'       => $status === 'published' ? 'draft' : $status,
            'publish_at'   => $status === 'scheduled' ? ($validated['publish_at'] ?? null) : null,
            'published_at' => null,
        ]);

        $post->tags()->sync($tagIds);
        $post->categories()->sync($categoryIds);

        if ($status === 'published') {
            $post->load('categories');

            // Create flow never auto-sends to Bale — only the preview confirm endpoint does.
            app(BaleService::class)->markManualBroadcastOnly($post->id);
            app(BlogPostPublisher::class)->publish($post, broadcastToBale: false);

            $showBalePreview = app(BaleService::class)->isConfigured()
                && $post->categories->contains(fn (BlogCategory $c) => (bool) $c->broadcast_to_bale);

            if ($showBalePreview) {
                $post = $post->fresh() ?? $post;

                return redirect()->route('blog.create')->with([
                    'success' => 'مقاله منتشر شد. پیش‌نمایش پیام بله را بررسی و در صورت نیاز ویرایش کنید.',
                    'bale_preview' => [
                        'post_id' => $post->id,
                        'title'   => $post->title,
                        'message' => app(BlogPostBroadcastFormatter::class)->format($post),
                    ],
                ]);
            }
        }

        return redirect()->route('blog.index')->with('success', 'مقاله با موفقیت ایجاد شد.');
    }

    public function broadcastBale(Request $request, BlogPost $blog): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:4096'],
        ]);

        $bale = app(BaleService::class);

        if (! $bale->isConfigured()) {
            return back()->with('error', 'ارسال به بله پیکربندی نشده است.');
        }

        $blog->load('categories');

        if ($blog->status !== 'published') {
            return back()->with('error', 'فقط مقالات منتشرشده را می‌توان به بله ارسال کرد.');
        }

        if (! $blog->categories->contains(fn (BlogCategory $c) => (bool) $c->broadcast_to_bale)) {
            return back()->with('error', 'هیچ دسته‌بندی با ارسال به بله برای این مقاله فعال نیست.');
        }

        $formatter = app(BlogPostBroadcastFormatter::class);
        $message   = $validated['message'];
        $photo     = $formatter->resolveFeaturedImagePath($blog)
            ?? $formatter->resolveFeaturedImageUrl($blog);

        $sent = filled($photo) && $bale->sendPhoto($photo, $message)
            ? true
            : $bale->sendMessage($message);

        $bale->clearManualBroadcastOnly($blog->id);

        if (! $sent) {
            return back()->with('error', 'ارسال به بله ناموفق بود. جزئیات در لاگ ثبت شد.');
        }

        return redirect()->route('blog.index')->with('success', 'پیام بله با موفقیت ارسال شد.');
    }

    public function edit(BlogPost $blog): Response
    {
        $blog->load(['tags', 'categories.fieldDefinitions', 'media', 'fieldValues']);

        $mediaByCollection = $blog->media
            ->groupBy('collection_name')
            ->map(fn ($items) => $items->values())
            ->toArray();

        $fieldDefinitions = $blog->categories
            ->flatMap(fn ($cat) => $cat->fieldDefinitions)
            ->unique('id')
            ->values();

        return Inertia::render('Blog/Edit', [
            'post'             => $blog,
            'postMedia'        => $mediaByCollection,
            'fieldDefinitions' => $fieldDefinitions,
            'fieldValues'      => $blog->fieldValues->pluck('value', 'category_field_definition_id'),
            'mediaCollections' => array_keys(\App\Models\BlogPost::MEDIA_COLLECTIONS),
            ...$this->formData(),
        ]);
    }

    public function update(Request $request, BlogPost $blog): RedirectResponse
    {
        $validated = $this->validatePost($request, $blog);
        $validated['featured_image'] = $validated['featured_image'] ?: null;
        $categoryIds = $validated['category_ids'] ?? [];
        $tagIds      = $validated['tag_ids'] ?? [];
        unset($validated['category_ids'], $validated['tag_ids']);

        $newStatus = $validated['status'];
        $wasPublished = $blog->status === 'published';
        $transitioningToPublished = $newStatus === 'published' && ! $wasPublished;

        if ($transitioningToPublished) {
            $validated['status']       = $blog->status;
            $validated['published_at'] = $blog->published_at;
            $validated['publish_at']   = $blog->publish_at;
        } else {
            $validated['published_at'] = $newStatus === 'published' ? $blog->published_at : null;
            $validated['publish_at']   = $newStatus === 'scheduled' ? ($validated['publish_at'] ?? null) : null;
        }

        $blog->update($validated);
        $blog->tags()->sync($tagIds);
        $blog->categories()->sync($categoryIds);

        foreach ($request->input('field_values', []) as $defId => $value) {
            $blog->fieldValues()->updateOrCreate(
                ['category_field_definition_id' => (int) $defId],
                ['value' => $value === '' ? null : $value],
            );
        }

        if ($transitioningToPublished) {
            app(BlogPostPublisher::class)->publish($blog->fresh());
        }

        return redirect()->route('blog.index')->with('success', 'مقاله به‌روزرسانی شد.');
    }

    public function destroy(BlogPost $blog): RedirectResponse
    {
        $blog->delete();

        return redirect()->route('blog.index')->with('success', 'مقاله حذف شد.');
    }

    public function instagram(Request $request, BlogPost $blog): Response
    {
        abort_unless($request->user()?->can('blog.instagram'), 403);

        $blog->load(['categories:id,name,slug']);

        $lastCategory = $blog->categories->last();

        return Inertia::render('Blog/InstagramGenerator', [
            'post' => [
                'id'             => $blog->id,
                'title'          => $blog->title,
                'subtitle'       => $blog->subtitle,
                'excerpt'        => $blog->excerpt,
                'description'    => $this->firstBodyParagraph($blog->body),
                'slug'           => $blog->slug,
                'short_link'     => $blog->short_link,
                'featured_image' => $blog->featured_image,
                'category'       => $lastCategory
                    ? ['id' => $lastCategory->id, 'name' => $lastCategory->name, 'slug' => $lastCategory->slug]
                    : null,
            ],
            'defaults' => [
                'color'           => '#075F26',
                'highlight_color' => '#E8A88A',
                'background_color'=> '#FFFFFF',
                'url'             => url('/blog/'.$blog->slug),
                'app_url'         => rtrim((string) config('app.url'), '/'),
            ],
        ]);
    }

    /**
     * Plain-text first paragraph from Quill/HTML body for Instagram copy.
     */
    private function firstBodyParagraph(?string $body): string
    {
        $html = trim((string) $body);
        if ($html === '') {
            return '';
        }

        if (preg_match('/<p\b[^>]*>(.*?)<\/p>/is', $html, $match)) {
            $text = html_entity_decode(strip_tags($match[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        } else {
            $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        $text = preg_replace('/\s+/u', ' ', trim($text)) ?? '';

        // If the first <p> was empty (spacer), fall back to the first non-empty paragraph.
        if ($text === '' && preg_match_all('/<p\b[^>]*>(.*?)<\/p>/is', $html, $matches)) {
            foreach ($matches[1] as $chunk) {
                $candidate = html_entity_decode(strip_tags($chunk), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $candidate = preg_replace('/\s+/u', ' ', trim($candidate)) ?? '';
                if ($candidate !== '') {
                    return $candidate;
                }
            }
        }

        return $text;
    }

    private function validatePost(Request $request, ?BlogPost $post = null): array
    {
        return $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'subtitle'         => ['nullable', 'string'],
            'excerpt'          => ['nullable', 'string', 'max:500'],
            'meta_title'       => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'body'             => ['required', 'string'],
            'status'           => ['required', 'in:draft,scheduled,published'],
            'publish_at'       => ['required_if:status,scheduled', 'nullable', 'date', 'after:now'],
            'featured_image'   => ['nullable', 'string', 'max:500'],
            'tag_ids'          => ['nullable', 'array'],
            'tag_ids.*'        => ['exists:blog_tags,id'],
            'category_ids'     => ['nullable', 'array'],
            'category_ids.*'   => ['exists:blog_categories,id'],
            'field_values'     => ['nullable', 'array'],
            'field_values.*'   => ['nullable', 'string', 'max:1000'],
        ]);
    }

    private function formData(): array
    {
        return [
            'categories' => BlogCategory::orderBy('name')->get(['id', 'name', 'parent_id', 'broadcast_to_bale']),
            'tags'       => BlogTag::orderBy('name')->get(['id', 'name']),
        ];
    }
}
