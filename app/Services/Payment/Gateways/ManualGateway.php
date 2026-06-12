<?php

namespace App\Services\Payment\Gateways;

use App\Models\Order;
use App\Services\Payment\PaymentGatewayInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Manual / offline gateway — used for credit purchases or internal bank transfers.
 * No external API call; initiate immediately marks the payment as confirmed.
 */
class ManualGateway implements PaymentGatewayInterface
{
    public function __construct(array $config) {}

    public function initiate(Order $order): RedirectResponse
    {
        // No external redirect — go straight to callback with a local token
        $token = 'manual-' . $order->id . '-' . now()->timestamp;
        session(["gw_manual_token_{$order->id}" => $token]);

        return redirect()->route('checkout.callback', $order->id);
    }

    public function verify(Request $request, Order $order): ?string
    {
        $token = session("gw_manual_token_{$order->id}");

        if (!$token) {
            return null;
        }

        session()->forget("gw_manual_token_{$order->id}");

        return $token;
    }
}