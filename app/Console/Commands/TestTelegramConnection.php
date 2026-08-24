<?php

namespace App\Console\Commands;

use App\Services\TelegramService;
use Illuminate\Console\Command;

class TestTelegramConnection extends Command
{
    protected $signature = 'telegram:test {--send : Send a test message to the configured Telegram channel}';

    protected $description = 'Verify Telegram bot credentials and optionally post a test message to the channel';

    public function handle(TelegramService $telegram): int
    {
        if (! $telegram->isConfigured()) {
            $this->error('Telegram is not configured. Set TELEGRAM_ENABLED=true, TELEGRAM_BOT_TOKEN, and TELEGRAM_CHANNEL_ID in .env');

            return self::FAILURE;
        }

        $proxy = config('services.telegram.http_proxy');
        if (filled($proxy)) {
            $this->line('Using TELEGRAM_HTTP_PROXY: '.$proxy);
        } else {
            $this->warn('TELEGRAM_HTTP_PROXY is empty — direct connection to api.telegram.org.');
        }

        $this->info('Checking bot token (getMe)...');

        $bot = $telegram->getMe();

        if (! $bot) {
            $this->error('getMe failed — check TELEGRAM_BOT_TOKEN, TELEGRAM_HTTP_PROXY, and network access.');

            return self::FAILURE;
        }

        $username = $bot['username'] ?? 'unknown';
        $this->info("Bot OK: @{$username} (id: {$bot['id']})");

        $channelError = $telegram->validateChannelTarget();

        if ($channelError) {
            $this->error($channelError);

            return self::FAILURE;
        }

        $chat = $telegram->getChat();
        $title  = $chat['title'] ?? config('services.telegram.channel_id');
        $this->info("Channel OK: {$title}");

        if (! $this->option('send')) {
            $this->line('Add --send to post a test message to the channel.');

            return self::SUCCESS;
        }

        $channel = config('services.telegram.channel_id');
        $this->info("Sending test message to {$channel}...");

        $sent = $telegram->sendMessage(
            "✅ اتصال کانال تلگرام برقرار است\n\nاین یک پیام آزمایشی از ".config('app.name').' است.',
        );

        if (! $sent) {
            $this->error('sendMessage failed — check storage/logs/laravel.log for details.');

            return self::FAILURE;
        }

        $this->info('Test message sent successfully.');

        return self::SUCCESS;
    }
}
