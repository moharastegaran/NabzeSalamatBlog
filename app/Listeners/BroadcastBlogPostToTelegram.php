<?php

namespace App\Listeners;

use App\Events\BlogPostPublished;
use App\Services\BlogPostBroadcastFormatter;
use App\Services\TelegramService;
use Illuminate\Contracts\Queue\ShouldQueue;

class BroadcastBlogPostToTelegram implements ShouldQueue
{
    private const PHOTO_CAPTION_LIMIT = 1024;

    public function __construct(
        private TelegramService $telegram,
        private BlogPostBroadcastFormatter $formatter,
    ) {}

    public function handle(BlogPostPublished $event): void
    {
        if (! $this->telegram->isConfigured()) {
            return;
        }

        $post = $event->post->fresh(['author', 'categories']);

        if (! $post || $post->status !== 'published') {
            return;
        }

        $message = $this->formatter->format($post);
        $photo   = $this->formatter->resolveFeaturedImagePath($post)
            ?? $this->formatter->resolveFeaturedImageUrl($post);
        $caption = $this->formatter->format($post, self::PHOTO_CAPTION_LIMIT);

        if (filled($photo) && $this->telegram->sendPhoto($photo, $caption)) {
            return;
        }

        $this->telegram->sendMessage($message);
    }
}
