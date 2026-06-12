<?php

namespace App\Services\Payment;

use App\Models\PaymentGateway;
use App\Services\Payment\Gateways\KalanoGateway;
use App\Services\Payment\Gateways\ManualGateway;
use App\Services\Payment\Gateways\ZarinpalGateway;

class GatewayResolver
{
    private array $map = [
        'zarinpal' => ZarinpalGateway::class,
        'manual'   => ManualGateway::class,
        'kalano'   => KalanoGateway::class,
    ];

    // Metadata shown in the admin UI for each driver
    private array $meta = [
        'zarinpal' => [
            'label'         => 'زرین‌پال',
            'required_keys' => ['merchant_id', 'sandbox'],
        ],
        'manual' => [
            'label'         => 'دستی / اعتباری',
            'required_keys' => [],
        ],
        'kalano' => [
            'label'         => 'کالانو',
            'required_keys' => [],
        ],
    ];

    public function resolve(PaymentGateway $gateway): PaymentGatewayInterface
    {
        // configurations is cast to an assoc array: ["driver" => "zarinpal", "merchant_id" => "..."]
        $config = $gateway->configurations ?? [];
        $driver = $config['driver'] ?? null;

        abort_unless(
            $driver && isset($this->map[$driver]),
            422,
            "درایور پرداخت «{$driver}» پشتیبانی نمی‌شود"
        );

        return new $this->map[$driver]($config);
    }

    // Returns driver options for the admin UI: [['key'=>'zarinpal','label'=>'...','required_keys'=>[...]]]
    public function drivers(): array
    {
        return collect($this->meta)
            ->map(fn ($m, $key) => ['key' => $key, ...$m])
            ->values()
            ->all();
    }
}