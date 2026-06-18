<?php

namespace App\Http\Controllers;

use App\Models\BreakingNews;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BreakingNewsController extends Controller
{
    public function index(): Response
    {
        $items = BreakingNews::orderByDesc('created_at')
            ->get()
            ->map(fn ($item) => [
                'id'           => $item->id,
                'title'        => $item->title,
                'url'          => $item->url,
                'is_active'    => $item->is_active,
                'active_from'  => $item->active_from?->format('Y-m-d H:i'),
                'active_until' => $item->active_until?->format('Y-m-d H:i'),
                'created_at'   => $item->created_at,
            ]);

        return Inertia::render('BreakingNews/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'url'          => ['nullable', 'url', 'max:500'],
            'is_active'    => ['boolean'],
            'active_from'  => ['nullable', 'date', 'after_or_equal:now'],
            'active_until' => ['nullable', 'date', 'after:now', 'after:active_from'],
        ], [
            'title.required'             => 'عنوان الزامی است.',
            'url.url'                    => 'آدرس وارد شده معتبر نیست.',
            'active_from.after_or_equal' => 'تاریخ شروع باید برابر یا بزرگ‌تر از زمان جاری باشد.',
            'active_until.after'         => 'تاریخ پایان باید بزرگ‌تر از زمان جاری و تاریخ شروع باشد.',
        ]);

        BreakingNews::create($data);

        return back()->with('success', 'خبر فوری با موفقیت ثبت شد.');
    }

    public function update(Request $request, BreakingNews $breakingNews): RedirectResponse
    {
        $data = $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'url'          => ['nullable', 'url', 'max:500'],
            'is_active'    => ['boolean'],
            'active_from'  => ['nullable', 'date'],
            'active_until' => ['nullable', 'date', 'after:active_from'],
        ], [
            'title.required'     => 'عنوان الزامی است.',
            'url.url'            => 'آدرس وارد شده معتبر نیست.',
            'active_until.after' => 'تاریخ پایان باید بزرگ‌تر از تاریخ شروع باشد.',
        ]);

        $breakingNews->update($data);

        return back()->with('success', 'خبر فوری با موفقیت ویرایش شد.');
    }

    public function destroy(BreakingNews $breakingNews): RedirectResponse
    {
        $breakingNews->delete();

        return back()->with('success', 'خبر فوری با موفقیت حذف شد.');
    }
}
