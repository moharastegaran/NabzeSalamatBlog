<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;

class PublishScheduledPosts extends Command
{
    protected $signature   = 'posts:publish-scheduled';
    protected $description = 'Publish any scheduled posts whose publish_at time has arrived';

    public function handle(): int
    {
        $count = BlogPost::where('status', 'scheduled')
            ->where('publish_at', '<=', now())
            ->update([
                'status'       => 'published',
                'published_at' => now(),
            ]);

        if ($count) {
            $this->info("Published {$count} scheduled post(s).");
        }

        return self::SUCCESS;
    }
}
