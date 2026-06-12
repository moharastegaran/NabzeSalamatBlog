<?php

namespace App\Http\Controllers;

use App\Models\BlogTag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogTagController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Blog/Tags', [
            'tags' => BlogTag::withCount('posts')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:blog_tags,name'],
        ]);

        BlogTag::create($validated);

        return back()->with('success', "برچسب \"{$validated['name']}\" افزوده شد.");
    }

    public function update(Request $request, BlogTag $blogTag): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:blog_tags,name,' . $blogTag->id],
        ]);

        $blogTag->update($validated);

        return back()->with('success', "برچسب \"{$blogTag->name}\" به‌روزرسانی شد.");
    }

    public function destroy(BlogTag $blogTag): RedirectResponse
    {
        $name = $blogTag->name;
        $blogTag->delete();

        return back()->with('success', "برچسب \"{$name}\" حذف شد.");
    }
}
