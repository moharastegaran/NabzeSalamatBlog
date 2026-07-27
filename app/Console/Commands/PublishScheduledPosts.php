<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use App\Services\BlogPostPublisher;
use Illuminate\Console\Command;

class PublishScheduledPosts extends Command
{
    protected $signature   = 'posts:publish-scheduled';

    protected $description = 'Publish any scheduled posts whose publish_at time has arrived';

    public function handle(BlogPostPublisher $publisher): int
    {
        $count = 0;

        BlogPost::query()
            ->where('status', 'scheduled')
            ->where('publish_at', '<=', now())
            ->each(function (BlogPost $post) use ($publisher, &$count) {
                $publisher->publish($post);
                $count++;
            });

        if ($count) {
            $this->info("Published {$count} scheduled post(s).");
        }

        return self::SUCCESS;
    }
}
