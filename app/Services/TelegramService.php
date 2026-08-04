<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private const PHOTO_CAPTION_LIMIT = 1024;

    private ?string $token;

    private ?string $channelId;

    private bool $enabled;

    public function __construct()
    {
        $this->token     = config('services.telegram.bot_token');
        $this->channelId = config('services.telegram.channel_id');
        $this->enabled   = (bool) config('services.telegram.enabled', false);
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

        $response = Http::timeout(15)->get($this->apiUrl('getMe'));

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::error('Telegram getMe failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return null;
        }

        return $response->json('result');
    }

    public function getChat(): ?array
    {
        if (! filled($this->token) || ! filled($this->channelId)) {
            return null;
        }

        $response = Http::timeout(15)->get($this->apiUrl('getChat'), [
            'chat_id' => $this->channelId,
        ]);

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::warning('Telegram getChat failed', [
                'chat_id' => $this->channelId,
                'status'  => $response->status(),
                'body'    => $response->body(),
            ]);

            return null;
        }

        return $response->json('result');
    }

    public function validateChannelTarget(): ?string
    {
        if (! $this->isConfigured()) {
            return 'Telegram is not configured.';
        }

        $bot = $this->getMe();

        if ($bot && filled($bot['username'] ?? null)) {
            $target = ltrim((string) $this->channelId, '@');

            if (strcasecmp($target, $bot['username']) === 0) {
                return 'TELEGRAM_CHANNEL_ID is set to the bot username. Use your channel @username or numeric channel ID (-100...).';
            }
        }

        $chat = $this->getChat();

        if (! $chat) {
            return 'Cannot access TELEGRAM_CHANNEL_ID. Add the bot as a channel admin with "Post messages" permission.';
        }

        if (($chat['type'] ?? '') !== 'channel') {
            return 'TELEGRAM_CHANNEL_ID must be a Telegram channel. Groups and private chats are not supported.';
        }

        return null;
    }

    public function sendMessage(string $text): bool
    {
        if ($error = $this->validateChannelTarget()) {
            Log::warning('Telegram sendMessage skipped', ['reason' => $error]);

            return false;
        }

        $response = Http::timeout(15)
            ->asJson()
            ->post($this->apiUrl('sendMessage'), [
                'chat_id'                  => $this->channelId,
                'text'                     => $text,
                'parse_mode'               => 'Markdown',
                'disable_web_page_preview' => true,
            ]);

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::error('Telegram sendMessage failed', [
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
        if ($error = $this->validateChannelTarget()) {
            Log::warning('Telegram sendPhoto skipped', ['reason' => $error]);

            return false;
        }

        if (strlen($caption) > self::PHOTO_CAPTION_LIMIT) {
            $caption = mb_substr($caption, 0, self::PHOTO_CAPTION_LIMIT - 1).'…';
        }

        if (is_file($photo)) {
            return $this->sendPhotoUpload($photo, $caption);
        }

        $response = Http::timeout(20)
            ->asJson()
            ->post($this->apiUrl('sendPhoto'), [
                'chat_id'                  => $this->channelId,
                'photo'                    => $photo,
                'caption'                  => $caption,
                'parse_mode'               => 'Markdown',
                'disable_web_page_preview' => true,
            ]);

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::warning('Telegram sendPhoto failed', [
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
            Log::warning('Telegram sendPhoto upload failed: cannot open file', ['path' => $path]);

            return false;
        }

        try {
            $response = Http::timeout(30)
                ->attach('photo', $handle, basename($path))
                ->post($this->apiUrl('sendPhoto'), [
                    'chat_id'                  => $this->channelId,
                    'caption'                  => $caption,
                    'parse_mode'               => 'Markdown',
                    'disable_web_page_preview' => true,
                ]);
        } finally {
            fclose($handle);
        }

        if (! $response->successful() || ! ($response->json('ok') ?? false)) {
            Log::warning('Telegram sendPhoto upload failed', [
                'path'   => $path,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    private function apiUrl(string $method): string
    {
        return "https://api.telegram.org/bot{$this->token}/{$method}";
    }
}
