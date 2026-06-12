<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerProfileController extends Controller
{
    public function address(): Response
    {
        $user = Auth::user()->load('city.province');

        return Inertia::render('Customer/Address', [
            'user'      => [
                'city_id'     => $user->city_id,
                'province_id' => $user->city?->province_id,
            ],
            'provinces' => Province::with('cities')->orderBy('name')->get(),
        ]);
    }

    public function updateAddress(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
        ]);

        Auth::user()->update($validated);

        return back()->with('success', 'آدرس با موفقیت ذخیره شد.');
    }

    public function userInfo(): Response
    {
        $user = Auth::user();

        return Inertia::render('Customer/Profile', [
            'user' => [
                'name'       => $user->name,
                'email'      => $user->email,
                'mobile'     => $user->mobile,
                'melli_code' => $user->melli_code,
            ],
        ]);
    }

    public function updateUserInfo(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:100',
            'email'      => 'nullable|email|max:255|unique:users,email,' . Auth::id(),
            'mobile'     => ['nullable', 'string', 'regex:/^0\d{10}$/'],
            'melli_code' => ['nullable', 'string', 'size:10', new \App\Rules\ValidMelliCode()],
        ]);

        Auth::user()->update($validated);

        return back()->with('success', 'اطلاعات کاربری با موفقیت ذخیره شد.');
    }
}
