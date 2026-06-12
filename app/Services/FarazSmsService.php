<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FarazSmsService
{
    private ?string $apiKey;
    private ?string $sender;
    private ?string $otpPattern;

    public function __construct()
    {
        $this->apiKey     = config('services.farazsms.api_key');
        $this->sender     = config('services.farazsms.sender');
        $this->otpPattern = config('services.farazsms.otp_pattern');
    }

    public function sendOtp(string $mobile, string $code): bool
    {
        $response = Http::withHeaders(['apikey' => $this->apiKey])
            ->post('https://api2.ippanel.com/api1/sms/pattern/normal/send', [
                'code'      => $this->otpPattern,
                'sender'    => $this->sender,
                'recipient' => $this->normalizeNumber($mobile),
                'variable'  => ['verification-code' => $code],
            ]);

        if (! $response->successful()) {
            Log::error('FarazSMS send failed', [
                'mobile' => $mobile,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return false;
        }

        return true;
    }

    /** Convert 09XXXXXXXXX → +989XXXXXXXXX */
    public function normalizeNumber(string $mobile): string
    {
        $mobile = preg_replace('/\D/', '', $mobile);

        if (str_starts_with($mobile, '0')) {
            $mobile = '98' . substr($mobile, 1);
        }

        return '+' . $mobile;
    }
}
