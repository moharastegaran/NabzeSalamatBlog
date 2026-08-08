<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdvertiseModalController extends Controller
{
    public function edit(): Response
    {
        $page = PageContent::forSlug('advertise-modal');

        return Inertia::render('AdvertiseModal/Edit', [
            'page' => [
                'title'   => $page->title,
                'content' => $page->content ?: PageContent::advertiseModalDefaults(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'                         => ['required', 'string', 'max:255'],
            'content'                       => ['required', 'array'],
            'content.title'                 => ['required', 'string', 'max:255'],
            'content.subtitle'              => ['required', 'string', 'max:255'],
            'content.descriptions'          => ['required', 'array', 'min:1'],
            'content.descriptions.*'        => ['required', 'string', 'max:2000'],
            'content.features'              => ['required', 'array', 'min:1'],
            'content.features.*'            => ['required', 'string', 'max:500'],
            'content.hint'                  => ['required', 'string', 'max:1000'],
            'content.primary_button'        => ['required', 'array'],
            'content.primary_button.label'  => ['required', 'string', 'max:100'],
            'content.primary_button.url'    => ['required', 'string', 'max:1000'],
            'content.secondary_button'      => ['required', 'array'],
            'content.secondary_button.label'=> ['required', 'string', 'max:100'],
            'content.secondary_button.url'  => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validated['content']['secondary_button']['url'] === '') {
            $validated['content']['secondary_button']['url'] = null;
        }

        PageContent::query()->updateOrCreate(
            ['slug' => 'advertise-modal'],
            [
                'title'   => $validated['title'],
                'content' => $validated['content'],
            ],
        );

        return back()->with('success', 'محتوای مودال آگهی به‌روزرسانی شد.');
    }
}
