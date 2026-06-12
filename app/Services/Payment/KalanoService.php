<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class KalanoService
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('kalano.base_url');
    }

    public function getBalance(string $melliCode): array
    {
        $response = Http::withToken($this->getToken())
            ->get("{$this->baseUrl}/facilitycustomer/api/v1/customers/{$melliCode}/balance");

        return $this->normalize($response->json());
    }

    public function requestAuthorization(string $melliCode, int $amount): array
    {
        $trackId  = Str::lower(Str::random(29));
        $response = Http::withToken($this->getToken())
            ->contentType('application/json-patch+json')
            ->post("{$this->baseUrl}/facilitycustomer/api/v1/customers/{$melliCode}/purchases/authorization?trackId={$trackId}", [
                'amount'      => $amount,
                'description' => 'فاکتور',
            ]);

        $data            = $this->normalize($response->json());
        $data['trackId'] = $trackId;

        return $data;
    }

    public function approvePurchase(string $melliCode, int $amount, string $otp, string $trackId): array
    {
        $response = Http::withToken($this->getToken())
            ->contentType('application/json-patch+json')
            ->post("{$this->baseUrl}/facilitycustomer/api/v1/customers/{$melliCode}/purchases?trackId={$trackId}", [
                'otp'         => $otp,
                'amount'      => $amount,
                'description' => 'فاکتور',
            ]);

        return $this->normalize($response->json());
    }

    public function advice(string $melliCode, string $trackId): array
    {
        $response = Http::withToken($this->getToken())
            ->contentType('application/json-patch+json')
            ->post("{$this->baseUrl}/facilitycustomer/api/v1/customers/{$melliCode}/purchases/advice?trackId={$trackId}");

        return $this->normalize($response->json());
    }

    // Cached so the token is only fetched once per TTL window, not on every request.
    private function getToken(): string
    {
        return Cache::remember('kalano_access_token', 3000, function () {
            $response = Http::asForm()->post("{$this->baseUrl}/token", [
                'client_id'     => config('kalano.client_id'),
                'client_secret' => config('kalano.client_secret'),
                'grant_type'    => config('kalano.grant_type'),
                'username'      => config('kalano.username'),
                'password'      => config('kalano.password'),
            ]);

            return $response->json('access_token');
        });
    }

    private function normalize(?array $response): array
    {
        if (!$response) {
            return ['status' => '500', 'result' => null, 'title' => null];
        }

        return [
            'status' => (string) ($response['status'] ?? '200'),
            'result' => $response['result'] ?? null,
            'title'  => $response['title'] ?? null,
        ];
    }
}
