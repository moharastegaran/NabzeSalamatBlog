<?php

namespace App\Services\Payment\Gateways;

use App\Models\Order;
use App\Services\Payment\PaymentGatewayInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class KalanoGateway implements PaymentGatewayInterface
{
    public function __construct(private array $config) {}

    public function initiate(Order $order): RedirectResponse
    {
        return redirect()->route('orders.pay', $order);
    }

    // Verification is handled by KalanoPaymentController::processAdvice() — never reached via standard callback.
    public function verify(Request $request, Order $order): ?string
    {
        return null;
    }
}
