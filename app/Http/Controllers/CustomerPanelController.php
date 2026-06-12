<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerPanelController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = Auth::user();

        $base = fn () => Order::where('user_id', $user->id);

        $stats = [
            'in_progress' => (clone $base())->whereIn('status', [
                'pending_rm_approval', 'pending_cfo_approval', 'in_progress', 'awaiting_withdrawal',
            ])->count(),
            'shipped'     => (clone $base())->where('status', 'shipped')->count(),
            'cancelled'   => (clone $base())->where('status', 'cancelled')->count(),
        ];

        $tab   = $request->query('tab', 'in_progress');
        $query = (clone $base())->with(['banking', 'products'])->orderByDesc('created_at');

        match ($tab) {
            'shipped'   => $query->where('status', 'shipped'),
            'cancelled' => $query->where('status', 'cancelled'),
            default     => $query->whereIn('status', [
                'pending_rm_approval', 'pending_cfo_approval', 'in_progress', 'awaiting_withdrawal',
            ]),
        };

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('Customer/Panel', [
            'stats'  => $stats,
            'orders' => $orders,
            'tab'    => $tab,
        ]);
    }

    public function orderShow(Order $order): Response|RedirectResponse
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load([
            'products.variation.product',
            'products.variation.attributes.type',
            'meta.city.province',
            'banking',
            'transaction.gateway',
        ]);

        return Inertia::render('Customer/OrderShow', [
            'order' => $order,
        ]);
    }

    public function activities(): Response
    {
        $user = Auth::user();

        $base = fn () => Order::where('user_id', $user->id);

        $stats = [
            'in_progress' => (clone $base())->whereIn('status', [
                'pending_rm_approval', 'pending_cfo_approval', 'in_progress', 'awaiting_withdrawal',
            ])->count(),
            'shipped'     => (clone $base())->where('status', 'shipped')->count(),
            'cancelled'   => (clone $base())->where('status', 'cancelled')->count(),
        ];

        $products = Product::where('status', 'published')
            ->with(['variations.attributes'])
            ->latest()
            ->limit(9)
            ->get(['id', 'title', 'images', 'product_type', 'status']);

        return Inertia::render('Customer/Activities', [
            'stats'    => $stats,
            'products' => $products,
        ]);
    }
}
