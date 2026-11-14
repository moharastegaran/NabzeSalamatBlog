<?php

namespace App\Services;

use App\Events\BlogPostPublished;
use App\Models\BlogPost;

class BlogPostPublisher
{
    public function publish(BlogPost $post, bool $broadcastToBale = true): void
    {
        if ($post->status === 'published') {
            return;
        }

        $post->forceFill([
            'status'       => 'published',
            'published_at' => now(),
            'publish_at'   => null,
        ])->save();

        BlogPostPublished::dispatch($post, $broadcastToBale);
    }
}
