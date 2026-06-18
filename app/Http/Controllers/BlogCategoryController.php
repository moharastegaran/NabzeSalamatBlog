<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Blog/Categories/Index', [
            'categories' => BlogCategory::with('parent')->withCount(['posts', 'children'])->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Blog/Categories/Create', [
            'parents' => BlogCategory::orderBy('name')->get(['id', 'name', 'parent_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:blog_categories,slug'],
            'description' => ['nullable', 'string', 'max:500'],
            'parent_id'   => ['nullable', 'exists:blog_categories,id'],
            'icon'        => ['nullable', 'string', 'max:500'],
            'thumbnail'   => ['nullable', 'string', 'max:500'],
        ]);

        BlogCategory::create($validated);

        return redirect()->route('blog.categories.index')->with('success', "دسته‌بندی \"{$validated['name']}\" افزوده شد.");
    }

    public function edit(BlogCategory $blogCategory): Response
    {
        return Inertia::render('Blog/Categories/Edit', [
            'category' => $blogCategory,
            'parents'  => BlogCategory::where('id', '!=', $blogCategory->id)
                ->orderBy('name')
                ->get(['id', 'name', 'parent_id']),
        ]);
    }

    public function update(Request $request, BlogCategory $blogCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('blog_categories', 'slug')->ignore($blogCategory->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'parent_id'   => ['nullable', 'exists:blog_categories,id'],
            'icon'        => ['nullable', 'string', 'max:500'],
            'thumbnail'   => ['nullable', 'string', 'max:500'],
        ]);

        $blogCategory->update($validated);

        return redirect()->route('blog.categories.index')->with('success', "دسته‌بندی \"{$blogCategory->name}\" به‌روزرسانی شد.");
    }

    public function destroy(BlogCategory $blogCategory): RedirectResponse
    {
        $name = $blogCategory->name;
        $blogCategory->delete();

        return back()->with('success', "دسته‌بندی \"{$name}\" حذف شد.");
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer', 'exists:blog_categories,id']])['ids'];

        $count = BlogCategory::whereIn('id', $ids)->count();
        BlogCategory::whereIn('id', $ids)->delete();

        return back()->with('success', "{$count} دسته‌بندی حذف شد.");
    }
}
