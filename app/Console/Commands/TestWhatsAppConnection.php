<?php

namespace App\Console\Commands;

use App\Services\WhatsAppService;
use Illuminate\Console\Command;

class TestWhatsAppConnection extends Command
{
    protected $signature = 'whatsapp:test {--send : Send a test message to the configured channel}';

    protected $description = 'Verify WhatsApp channel API credentials and optionally send a test message';

    public function handle(WhatsAppService $whatsapp): int
    {
        if (! $whatsapp->isConfigured()) {
            $this->error('WhatsApp is not configured. Set WHATSAPP_ENABLED=true, WHATSAPP_API_TOKEN, and WHATSAPP_CHANNEL_ID in .env');

            return self::FAILURE;
        }

        if (! $this->option('send')) {
            $this->info('WhatsApp channel credentials are present.');
            $this->line('Channel: '.config('services.whatsapp.channel_id'));
            $this->line('Add --send to post a test message to the channel.');

            return self::SUCCESS;
        }

        $this->info('Sending test message to WhatsApp channel...');

        $sent = $whatsapp->sendText(
            "✅ * اتصال واتساپ برقرار است *\n\nاین یک پیام آزمایشی از ".config('app.name').' است.',
        );

        if (! $sent) {
            $this->error('sendText failed — check WHATSAPP_API_TOKEN, WHATSAPP_CHANNEL_ID, and storage/logs/laravel.log');

            return self::FAILURE;
        }

        $this->info('Test message sent successfully.');

        return self::SUCCESS;
    }
}
