<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FooterBrandController extends Controller
{
    public function edit(): Response
    {
        $page = PageContent::forSlug('footer-brand');

        return Inertia::render('FooterBrand/Edit', [
            'page' => [
                'title'   => $page->title,
                'content' => $page->content ?: PageContent::footerBrandDefaults(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'content'      => ['required', 'array'],
            'content.html' => ['required', 'string', 'max:20000'],
        ]);

        $html = $validated['content']['html'];
        if (trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8')) === '') {
            return back()->withErrors(['content.html' => 'متن معرفی فوتر نمی‌تواند خالی باشد.']);
        }

        PageContent::query()->updateOrCreate(
            ['slug' => 'footer-brand'],
            [
                'title'   => $validated['title'],
                'content' => ['html' => $html],
            ],
        );

        return back()->with('success', 'متن معرفی فوتر به‌روزرسانی شد.');
    }
}
