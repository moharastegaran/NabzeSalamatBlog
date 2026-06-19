<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use App\Models\PostMedia;
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

        $posts = BlogPost::with(['author', 'categories'])
            ->withCount('comments')
            ->when($categoryId, fn ($q) => $q->whereHas('categories', fn ($q) => $q->where('blog_categories.id', $categoryId)))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $activeCategory = $categoryId
            ? BlogCategory::find($categoryId, ['id', 'name'])
            : null;

        return Inertia::render('Blog/Index', [
            'posts'          => $posts,
            'activeCategory' => $activeCategory,
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

        $post = BlogPost::create([
            ...$validated,
            'author_id'    => auth()->id(),
            'slug'         => Str::slug($validated['title']),
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        $post->tags()->sync($tagIds);
        $post->categories()->sync($categoryIds);

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

        if ($blog->status === 'draft' && $validated['status'] === 'published' && ! $blog->published_at) {
            $validated['published_at'] = now();
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
            'excerpt'          => ['nullable', 'string', 'max:500'],
            'body'             => ['required', 'string'],
            'status'           => ['required', 'in:draft,published'],
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
