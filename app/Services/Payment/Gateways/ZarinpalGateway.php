<?php

namespace App\Services\Payment\Gateways;

use App\Models\Order;
use App\Services\Payment\PaymentGatewayInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ZarinpalGateway implements PaymentGatewayInterface
{
    private string $merchantId;
    private bool $sandbox;

    public function __construct(array $config)
    {
        $this->merchantId = $config['merchant_id'] ?? '';
        $this->sandbox    = filter_var($config['sandbox'] ?? false, FILTER_VALIDATE_BOOLEAN);
    }

    public function initiate(Order $order): RedirectResponse
    {
        $total = $this->orderTotal($order);

        $response = Http::post($this->apiUrl('payment/request.json'), [
            'merchant_id'  => $this->merchantId,
            'amount'       => $total,
            'callback_url' => route('checkout.callback', $order->id),
            'description'  => "پرداخت سفارش #{$order->id}",
        ])->json();

        $authority = $response['data']['authority'] ?? null;

        abort_unless($authority, 502, 'خطا در اتصال به درگاه زرین‌پال');

        session(["gw_authority_{$order->id}" => $authority]);

        $startUrl = $this->sandbox
            ? "https://sandbox.zarinpal.com/pg/StartPay/{$authority}"
            : "https://www.zarinpal.com/pg/StartPay/{$authority}";

        return redirect($startUrl);
    }

    public function verify(Request $request, Order $order): ?string
    {
        if ($request->input('Status') !== 'OK') {
            return null;
        }

        $authority = session("gw_authority_{$order->id}");
        $total     = $this->orderTotal($order);

        $response = Http::post($this->apiUrl('payment/verify.json'), [
            'merchant_id' => $this->merchantId,
            'amount'      => $total,
            'authority'   => $authority,
        ])->json();

        $code  = $response['data']['code']   ?? null;
        $refId = $response['data']['ref_id'] ?? null;

        // Code 100 = success, 101 = already verified
        if (!in_array($code, [100, 101], true) || !$refId) {
            return null;
        }

        session()->forget("gw_authority_{$order->id}");

        return (string) $refId;
    }

    private function orderTotal(Order $order): int
    {
        return (int) $order->products->sum(fn ($p) => $p->unit_price * $p->quantity);
    }

    private function apiUrl(string $endpoint): string
    {
        $base = $this->sandbox
            ? 'https://sandbox.zarinpal.com/pg/v4/'
            : 'https://api.zarinpal.com/pg/v4/';

        return $base . $endpoint;
    }
}
