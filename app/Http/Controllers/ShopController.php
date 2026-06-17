<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('Front/Landing', [
            'categories'       => [],
            'categoryProducts' => [],
            'paymentBanks'     => [],
            'cartCount'        => $this->cartCount(),
            'featuredProducts' => [
                'on_sale'    => [],
                'newest'     => [],
                'bestseller' => [],
            ],
            'saleEndsAt' => now()->addDays(14)->toIso8601String(),
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('Front/Index', [
            'products'     => [],
            'categories'   => [],
            'filters'      => [],
            'priceMin'     => 0,
            'priceMax'     => 0,
            'colorOptions' => [],
            'cartCount'    => $this->cartCount(),
        ]);
    }

    public function show(): Response
    {
        abort(404);
    }

    public function search(): JsonResponse
    {
        return response()->json([]);
    }

    public function aboutUs(): Response
    {
        return Inertia::render('Front/AboutUs', [
            'cartCount' => $this->cartCount(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Front/Contact', [
            'cartCount' => $this->cartCount(),
        ]);
    }

    public function gallery(): Response
    {
        $items = \App\Models\GalleryItem::with('city:id,name')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Front/Gallery', [
            'items'     => $items,
            'cartCount' => $this->cartCount(),
        ]);
    }

    private function cartCount(): int
    {
        return (int) collect(session('cart', []))->sum('quantity');
    }
}
