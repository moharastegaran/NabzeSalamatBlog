<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use App\Models\PostMedia;
use App\Services\BlogPostPublisher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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

        $statusCounts = BlogPost::when($categoryId, $categoryFilter)
            ->when($search, $searchFilter)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $activeCategory = $categoryId
            ? BlogCategory::find($categoryId, ['id', 'name'])
            : null;

        return Inertia::render('Blog/Index', [
            'posts'          => $posts,
            'activeCategory' => $activeCategory,
            'statusCounts'   => $statusCounts,
            'filters'        => ['search' => $search],
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
            'slug'         => Str::slug($validated['title']),
            'status'       => $status === 'published' ? 'draft' : $status,
            'publish_at'   => $status === 'scheduled' ? ($validated['publish_at'] ?? null) : null,
            'published_at' => null,
        ]);

        $post->tags()->sync($tagIds);
        $post->categories()->sync($categoryIds);

        if ($status === 'published') {
            app(BlogPostPublisher::class)->publish($post);
        }

        return redirect()->route('blog.index')->with('success', 'مقاله با موفقیت ایجاد شد.');
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

    private function validatePost(Request $request, ?BlogPost $post = null): array
    {
        return $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'subtitle'         => ['nullable', 'string'],
            'excerpt'          => ['nullable', 'string', 'max:500'],
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
            'categories' => BlogCategory::orderBy('name')->get(['id', 'name', 'parent_id']),
            'tags'       => BlogTag::orderBy('name')->get(['id', 'name']),
        ];
    }
}
