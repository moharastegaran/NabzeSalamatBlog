<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactPageController extends Controller
{
    public function edit(): Response
    {
        $page = PageContent::forSlug('contact');

        return Inertia::render('ContactPage/Edit', [
            'page' => [
                'title'   => $page->title,
                'content' => $page->content ?: PageContent::contactDefaults(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'                                   => ['required', 'string', 'max:255'],
            'content'                                 => ['required', 'array'],
            'content.seo.title'                       => ['required', 'string', 'max:255'],
            'content.seo.description'                 => ['required', 'string', 'max:500'],
            'content.hero.badge'                      => ['required', 'string', 'max:100'],
            'content.hero.title'                      => ['required', 'string', 'max:255'],
            'content.hero.subtitle'                   => ['required', 'string', 'max:1000'],
            'content.hero.cta_primary'                => ['required', 'string', 'max:100'],
            'content.hero.cta_secondary'              => ['required', 'string', 'max:100'],
            'content.contact_infos'                   => ['required', 'array', 'min:1'],
            'content.contact_infos.*.type'            => ['required', 'string', 'in:email,whatsapp,phone,address,telegram'],
            'content.contact_infos.*.label'           => ['required', 'string', 'max:100'],
            'content.contact_infos.*.value'           => ['required', 'string', 'max:500'],
            'content.contact_infos.*.description'     => ['nullable', 'string', 'max:500'],
            'content.contact_infos.*.icon'            => ['nullable', 'string', 'in:building,phone,whatsapp,email,telegram'],
            'content.editorial.title'                 => ['required', 'string', 'max:255'],
            'content.editorial.paragraphs'            => ['required', 'array', 'min:1'],
            'content.editorial.paragraphs.*'          => ['required', 'string', 'max:2000'],
            'content.editorial.quote'                 => ['nullable', 'string', 'max:500'],
            'content.form.title'                      => ['required', 'string', 'max:255'],
        ]);

        foreach ($validated['content']['contact_infos'] as $i => $info) {
            if (($info['description'] ?? '') === '') {
                $validated['content']['contact_infos'][$i]['description'] = null;
            }
            if (empty($info['icon'])) {
                $validated['content']['contact_infos'][$i]['icon'] = match ($info['type']) {
                    'address'  => 'building',
                    'phone'    => 'phone',
                    'whatsapp' => 'whatsapp',
                    'telegram' => 'telegram',
                    'email'    => 'email',
                    default    => 'building',
                };
            }
        }

        PageContent::query()->updateOrCreate(
            ['slug' => 'contact'],
            [
                'title'   => $validated['title'],
                'content' => $validated['content'],
            ],
        );

        return back()->with('success', 'محتوای صفحه تماس به‌روزرسانی شد.');
    }
}
