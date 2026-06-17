<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function show(): Response|\Illuminate\Http\RedirectResponse
    {
        if (! cache()->get('shop_maintenance', false)) {
            return redirect()->route('shop.landing');
        }

        return Inertia::render('Front/Maintenance');
    }

    public function toggle(): RedirectResponse
    {
        $current = (bool) cache()->get('shop_maintenance', false);
        cache()->put('shop_maintenance', ! $current, now()->addYear());

        $msg = $current ? 'فروشگاه فعال شد.' : 'حالت تعمیر و نگهداری فعال شد.';

        return back()->with('success', $msg);
    }
}
