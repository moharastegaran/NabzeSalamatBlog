<?php

namespace App\Console\Commands;

use App\Services\BaleService;
use Illuminate\Console\Command;

class TestBaleConnection extends Command
{
    protected $signature = 'bale:test {--send : Send a test message to the configured channel}';

    protected $description = 'Verify Bale bot credentials and optionally send a test message';

    public function handle(BaleService $bale): int
    {
        if (! $bale->isConfigured()) {
            $this->error('Bale is not configured. Set BALE_ENABLED=true, BALE_BOT_TOKEN, and BALE_CHANNEL_ID in .env');

            return self::FAILURE;
        }

        $this->info('Checking bot token (getMe)...');

        $bot = $bale->getMe();

        if (! $bot) {
            $this->error('getMe failed — check BALE_BOT_TOKEN and network access.');

            return self::FAILURE;
        }

        $username = $bot['username'] ?? 'unknown';
        $this->info("Bot OK: @{$username} (id: {$bot['id']})");

        if (! $this->option('send')) {
            $this->line('Add --send to post a test message to the channel.');

            return self::SUCCESS;
        }

        $channel = config('services.bale.channel_id');
        $this->info("Sending test message to {$channel}...");

        $sent = $bale->sendMessage(
            "✅ ** اتصال بله برقرار است **\n\nاین یک پیام آزمایشی از ".config('app.name').' است.',
        );

        if (! $sent) {
            $this->error('sendMessage failed — ensure the bot is an admin of the channel and BALE_CHANNEL_ID is correct.');

            return self::FAILURE;
        }

        $this->info('Test message sent successfully.');

        return self::SUCCESS;
    }
}
