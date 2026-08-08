<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FooterQuickLinksController extends Controller
{
    public function edit(): Response
    {
        $page = PageContent::forSlug('footer-quick-links');

        return Inertia::render('FooterQuickLinks/Edit', [
            'page' => [
                'title'   => $page->title,
                'content' => $page->content ?: PageContent::footerQuickLinksDefaults(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'                 => ['required', 'string', 'max:255'],
            'content'               => ['required', 'array'],
            'content.section_title' => ['required', 'string', 'max:100'],
            'content.links'         => ['required', 'array', 'min:1'],
            'content.links.*.label' => ['required', 'string', 'max:255'],
            'content.links.*.href'  => ['required', 'string', 'max:500'],
        ]);

        PageContent::query()->updateOrCreate(
            ['slug' => 'footer-quick-links'],
            [
                'title'   => $validated['title'],
                'content' => $validated['content'],
            ],
        );

        return back()->with('success', 'لینک‌های دسترسی سریع فوتر به‌روزرسانی شد.');
    }
}
