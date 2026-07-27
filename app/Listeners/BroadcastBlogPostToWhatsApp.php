<?php

namespace App\Listeners;

use App\Events\BlogPostPublished;
use App\Services\BlogPostBroadcastFormatter;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Queue\ShouldQueue;

class BroadcastBlogPostToWhatsApp implements ShouldQueue
{
    public function __construct(
        private WhatsAppService $whatsapp,
        private BlogPostBroadcastFormatter $formatter,
    ) {}

    public function handle(BlogPostPublished $event): void
    {
        if (! $this->whatsapp->isConfigured()) {
            return;
        }

        $post = $event->post->fresh(['author', 'categories']);

        if (! $post || $post->status !== 'published') {
            return;
        }

        $message  = $this->formatter->format($post);
        $localPath = $this->formatter->resolveFeaturedImagePath($post);
        $imageUrl  = $this->formatter->resolveFeaturedImageUrl($post);
        $media     = $localPath ?? $imageUrl;

        if (filled($media) && $this->whatsapp->sendImage($media, $message)) {
            return;
        }

        $this->whatsapp->sendText($message);
    }
}
