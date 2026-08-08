<?php

namespace App\Listeners;

use App\Events\BlogPostPublished;
use App\Services\BaleService;
use App\Services\BlogPostBroadcastFormatter;
use Illuminate\Contracts\Queue\ShouldQueue;

class BroadcastBlogPostToBale implements ShouldQueue
{
    public function __construct(
        private BaleService $bale,
        private BlogPostBroadcastFormatter $formatter,
    ) {}

    public function handle(BlogPostPublished $event): void
    {
        if (! $this->bale->isConfigured()) {
            return;
        }

        $post = $event->post->fresh(['author', 'categories']);

        if (! $post || $post->status !== 'published') {
            return;
        }

        $shouldBroadcast = $post->categories()
            ->where('broadcast_to_bale', true)
            ->exists();

        if (! $shouldBroadcast) {
            return;
        }

        $message = $this->formatter->format($post);
        $photo   = $this->formatter->resolveFeaturedImagePath($post)
            ?? $this->formatter->resolveFeaturedImageUrl($post);

        if (filled($photo) && $this->bale->sendPhoto($photo, $message)) {
            return;
        }

        $this->bale->sendMessage($message);
    }
}
