<?php

namespace App\Console\Commands;

use App\Events\BlogPostPublished;
use App\Models\BlogPost;
use Illuminate\Console\Command;

class TestTelegramBlogBroadcast extends Command
{
    protected $signature = 'telegram:test-broadcast {--post= : Blog post ID to broadcast}';

    protected $description = 'Dispatch a BlogPostPublished event to test the Telegram channel broadcast pipeline';

    public function handle(): int
    {
        $post = $this->option('post')
            ? BlogPost::find($this->option('post'))
            : BlogPost::where('status', 'published')->latest('published_at')->first();

        if (! $post) {
            $this->error('No published blog post found.');

            return self::FAILURE;
        }

        BlogPostPublished::dispatch($post);

        $this->info("Dispatched BlogPostPublished for post #{$post->id}: {$post->title}");
        $this->line('The queue worker will send the message to Telegram shortly.');

        return self::SUCCESS;
    }
}
