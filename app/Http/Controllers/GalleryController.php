<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $items = GalleryItem::with('city:id,name')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->orderByDesc('id')
            ->paginate(20);

        $provinces = Province::with('cities:id,province_id,name')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Gallery/Index', [
            'items'     => $items,
            'provinces' => $provinces,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'event'   => ['required', 'in:seminar,exhibition'],
            'city_id' => ['required', 'exists:cities,id'],
            'img'     => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'year'    => ['required', 'integer', 'min:1380', 'max:1450'],
            'month'   => ['required', 'integer', 'min:1', 'max:12'],
        ], [
            'event.required'   => 'نوع رویداد الزامی است.',
            'event.in'         => 'نوع رویداد معتبر نیست.',
            'city_id.required' => 'انتخاب شهر الزامی است.',
            'city_id.exists'   => 'شهر انتخاب‌شده معتبر نیست.',
            'img.required'     => 'تصویر الزامی است.',
            'img.mimes'        => 'فرمت تصویر باید JPG، PNG یا WEBP باشد.',
            'img.max'          => 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد.',
            'year.required'    => 'سال الزامی است.',
            'year.min'         => 'سال باید حداقل ۱۳۸۰ باشد.',
            'month.required'   => 'ماه الزامی است.',
            'month.min'        => 'ماه باید بین ۱ تا ۱۲ باشد.',
            'month.max'        => 'ماه باید بین ۱ تا ۱۲ باشد.',
        ]);

        $imgPath = $request->file('img')->store('gallery', 'public');

        GalleryItem::create([
            'event'   => $request->event,
            'city_id' => $request->city_id,
            'img'     => $imgPath,
            'year'    => $request->year,
            'month'   => $request->month,
        ]);

        return back()->with('success', 'تصویر با موفقیت اضافه شد.');
    }

    public function destroy(GalleryItem $gallery): RedirectResponse
    {
        if ($gallery->img) {
            Storage::disk('public')->delete($gallery->img);
        }

        $gallery->delete();

        return back()->with('success', 'تصویر با موفقیت حذف شد.');
    }
}
