<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AboutPageController extends Controller
{
    public function edit(): Response
    {
        $page = PageContent::forSlug('about-us');

        return Inertia::render('AboutPage/Edit', [
            'page' => [
                'title'   => $page->title,
                'content' => $page->content ?: PageContent::aboutUsDefaults(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'                                          => ['required', 'string', 'max:255'],
            'content'                                        => ['required', 'array'],
            'content.seo.title'                              => ['required', 'string', 'max:255'],
            'content.seo.description'                        => ['required', 'string', 'max:500'],
            'content.hero.badge'                             => ['required', 'string', 'max:100'],
            'content.hero.title'                             => ['required', 'string', 'max:255'],
            'content.hero.subtitle'                          => ['required', 'string', 'max:1000'],
            'content.hero.cta_primary'                       => ['required', 'string', 'max:100'],
            'content.hero.cta_secondary'                     => ['required', 'string', 'max:100'],
            'content.stats'                                  => ['required', 'array', 'min:1'],
            'content.stats.*.value'                          => ['required', 'string', 'max:50'],
            'content.stats.*.label'                          => ['required', 'string', 'max:100'],
            'content.mission.title'                          => ['required', 'string', 'max:255'],
            'content.mission.paragraphs'                     => ['required', 'array', 'min:1'],
            'content.mission.paragraphs.*'                   => ['required', 'string', 'max:2000'],
            'content.vision.title'                           => ['required', 'string', 'max:255'],
            'content.vision.paragraphs'                      => ['required', 'array', 'min:1'],
            'content.vision.paragraphs.*'                    => ['required', 'string', 'max:2000'],
            'content.vision.quote'                           => ['nullable', 'string', 'max:1000'],
            'content.policy.section_title'                   => ['required', 'string', 'max:255'],
            'content.policy.intro_title'                     => ['required', 'string', 'max:255'],
            'content.policy.paragraphs'                      => ['required', 'array', 'min:1'],
            'content.policy.paragraphs.*'                    => ['required', 'string', 'max:2000'],
            'content.policy.duties_title'                    => ['required', 'string', 'max:255'],
            'content.policy.duties'                          => ['required', 'array', 'min:1'],
            'content.policy.duties.*'                        => ['required', 'string', 'max:500'],
            'content.values.section_title'                   => ['required', 'string', 'max:255'],
            'content.values.items'                           => ['required', 'array', 'min:1'],
            'content.values.items.*.title'                   => ['required', 'string', 'max:100'],
            'content.values.items.*.desc'                    => ['required', 'string', 'max:500'],
            'content.values.items.*.icon'                    => ['required', 'string', 'in:integrity,accessibility,independence,freshness'],
            'content.editorial.section_title'                => ['required', 'string', 'max:255'],
            'content.editorial.items'                        => ['required', 'array', 'min:1'],
            'content.editorial.items.*.step'                 => ['required', 'string', 'max:10'],
            'content.editorial.items.*.title'                => ['required', 'string', 'max:100'],
            'content.editorial.items.*.desc'                 => ['required', 'string', 'max:500'],
            'content.cta.title'                              => ['required', 'string', 'max:255'],
            'content.cta.subtitle'                           => ['required', 'string', 'max:500'],
            'content.cta.cta_primary'                        => ['required', 'string', 'max:100'],
            'content.cta.cta_secondary'                      => ['required', 'string', 'max:100'],
        ]);

        PageContent::query()->updateOrCreate(
            ['slug' => 'about-us'],
            [
                'title'   => $validated['title'],
                'content' => $validated['content'],
            ],
        );

        return back()->with('success', 'محتوای صفحه درباره ما به‌روزرسانی شد.');
    }
}
