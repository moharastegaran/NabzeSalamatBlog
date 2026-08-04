<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BaleService
{
    private ?string $token;

    private ?string $channelId;

    private bool $enabled;

    public function __construct()
    {
        $this->token     = config('services.bale.bot_token');
        $this->channelId = config('services.bale.channel_id');
        $this->enabled   = (bool) config('services.bale.enabled', false);
    }

    public function isConfigured(): bool
    {
        return $this->enabled && filled($this->token) && filled($this->channelId);
    }

    public function getMe(): ?array
    {
        if (! filled($this->token)) {
            return null;
        }

        $response = Http::timeout(15)->get("https://tapi.bale.ai/bot{$this->token}/getMe");

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::error('Bale getMe failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return null;
        }

        return $response->json('result');
    }

    public function sendMessage(string $text): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $response = Http::timeout(15)
            ->asJson()
            ->post("https://tapi.bale.ai/bot{$this->token}/sendMessage", [
                'chat_id'                  => $this->channelId,
                'text'                     => $text,
                'parse_mode'               => 'Markdown',
                'disable_web_page_preview' => true,
            ]);

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::error('Bale sendMessage failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    /**
     * @param  string  $photo  Public URL or absolute local file path.
     */
    public function sendPhoto(string $photo, string $caption): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        if (is_file($photo)) {
            return $this->sendPhotoUpload($photo, $caption);
        }

        $response = Http::timeout(20)
            ->asJson()
            ->post("https://tapi.bale.ai/bot{$this->token}/sendPhoto", [
                'chat_id'                  => $this->channelId,
                'photo'                    => $photo,
                'caption'                  => $caption,
                'parse_mode'               => 'Markdown',
                'disable_web_page_preview' => true,
            ]);

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::warning('Bale sendPhoto failed', [
                'photo'  => $photo,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    private function sendPhotoUpload(string $path, string $caption): bool
    {
        $handle = fopen($path, 'r');

        if ($handle === false) {
            Log::warning('Bale sendPhoto upload failed: cannot open file', ['path' => $path]);

            return false;
        }

        try {
            $response = Http::timeout(30)
                ->attach('photo', $handle, basename($path))
                ->post("https://tapi.bale.ai/bot{$this->token}/sendPhoto", [
                    'chat_id'                  => $this->channelId,
                    'caption'                  => $caption,
                    'parse_mode'               => 'Markdown',
                    'disable_web_page_preview' => true,
                ]);
        } finally {
            fclose($handle);
        }

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::warning('Bale sendPhoto upload failed', [
                'path'   => $path,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return false;
        }

        return true;
    }
}
