<?php

namespace App\Services\Payment;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    public function initiate(Order $order): RedirectResponse;

    // Returns a transaction reference string on success, null on failure/cancellation
    public function verify(Request $request, Order $order): ?string;
}