<?php

namespace App\Http\Controllers;

use App\Models\AdBanner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdBannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('AdBanners/Index', [
            'banners'   => AdBanner::orderBy('sort_order')->orderByDesc('id')->get(),
            'locations' => AdBanner::LOCATIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('AdBanners/Form', [
            'banner'    => null,
            'locations' => AdBanner::LOCATIONS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'        => ['required', 'string', 'max:200'],
            'image'        => ['required', 'image', 'max:5120'],
            'external_url' => ['nullable', 'url', 'max:500'],
            'locations'    => ['required', 'array', 'min:1'],
            'locations.*'  => ['string', 'in:' . implode(',', array_keys(AdBanner::LOCATIONS))],
            'is_active'    => ['boolean'],
            'active_from'  => ['nullable', 'date'],
            'active_until' => ['nullable', 'date'],
            'sort_order'   => ['integer', 'min:0', 'max:9999'],
        ]);

        if ($data['active_from'] && $data['active_until'] && $data['active_until'] < $data['active_from']) {
            return back()->withErrors(['active_until' => 'تاریخ پایان باید بزرگ‌تر از تاریخ شروع باشد.'])->withInput();
        }

        $data['image'] = $request->file('image')->store('ad-banners', 'public');

        AdBanner::create($data);

        return redirect()->route('ad-banners.index')->with('success', 'بنر تبلیغاتی افزوده شد.');
    }

    public function edit(AdBanner $adBanner): Response
    {
        return Inertia::render('AdBanners/Form', [
            'banner'    => $adBanner,
            'locations' => AdBanner::LOCATIONS,
        ]);
    }

    public function update(Request $request, AdBanner $adBanner): RedirectResponse
    {
        $data = $request->validate([
            'title'        => ['required', 'string', 'max:200'],
            'image'        => ['nullable', 'image', 'max:5120'],
            'external_url' => ['nullable', 'url', 'max:500'],
            'locations'    => ['required', 'array', 'min:1'],
            'locations.*'  => ['string', 'in:' . implode(',', array_keys(AdBanner::LOCATIONS))],
            'is_active'    => ['boolean'],
            'active_from'  => ['nullable', 'date'],
            'active_until' => ['nullable', 'date'],
            'sort_order'   => ['integer', 'min:0', 'max:9999'],
        ]);

        if ($data['active_from'] && $data['active_until'] && $data['active_until'] < $data['active_from']) {
            return back()->withErrors(['active_until' => 'تاریخ پایان باید بزرگ‌تر از تاریخ شروع باشد.'])->withInput();
        }

        if ($request->hasFile('image')) {
            if ($adBanner->image) {
                Storage::disk('public')->delete($adBanner->image);
            }
            $data['image'] = $request->file('image')->store('ad-banners', 'public');
        } else {
            unset($data['image']);
        }

        $adBanner->update($data);

        return redirect()->route('ad-banners.index')->with('success', 'بنر تبلیغاتی ویرایش شد.');
    }

    public function toggleActive(AdBanner $adBanner): RedirectResponse
    {
        $adBanner->update(['is_active' => ! $adBanner->is_active]);

        return back()->with('success', $adBanner->is_active ? 'بنر فعال شد.' : 'بنر غیرفعال شد.');
    }

    public function destroy(AdBanner $adBanner): RedirectResponse
    {
        if ($adBanner->image) {
            Storage::disk('public')->delete($adBanner->image);
        }

        $adBanner->delete();

        return back()->with('success', 'بنر تبلیغاتی حذف شد.');
    }
}
