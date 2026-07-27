<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    private ?string $token;

    private ?string $baseUrl;

    private ?string $channelId;

    private bool $enabled;

    public function __construct()
    {
        $this->enabled   = (bool) config('services.whatsapp.enabled', false);
        $this->token     = config('services.whatsapp.api_token');
        $this->baseUrl   = rtrim((string) config('services.whatsapp.api_base_url', 'https://gate.whapi.cloud'), '/');
        $this->channelId = config('services.whatsapp.channel_id');
    }

    public function isConfigured(): bool
    {
        return $this->enabled && filled($this->token) && filled($this->channelId);
    }

    public function sendText(string $body): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $response = Http::timeout(20)
            ->withToken($this->token)
            ->acceptJson()
            ->post("{$this->baseUrl}/messages/text", [
                'to'   => $this->channelId,
                'body' => $body,
            ]);

        if (! $response->successful()) {
            Log::error('WhatsApp sendText failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    /**
     * @param  string  $media  Public URL or absolute local file path.
     */
    public function sendImage(string $media, string $caption): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $payload = [
            'to'      => $this->channelId,
            'caption' => $caption,
            'media'   => is_file($media) ? $this->encodeLocalImage($media) : $media,
        ];

        $response = Http::timeout(30)
            ->withToken($this->token)
            ->acceptJson()
            ->post("{$this->baseUrl}/messages/image", $payload);

        if (! $response->successful()) {
            Log::warning('WhatsApp sendImage failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    private function encodeLocalImage(string $path): string
    {
        $mime = mime_content_type($path) ?: 'image/jpeg';

        return 'data:'.$mime.';base64,'.base64_encode((string) file_get_contents($path));
    }
}
