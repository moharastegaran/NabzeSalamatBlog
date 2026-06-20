<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use App\Models\BlogPostView;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class SyncPostViews extends Command
{
    protected $signature   = 'views:sync';
    protected $description = 'Flush buffered view counts from Redis to MySQL';

    public function handle(): int
    {
        // Prevent concurrent runs (max 2-minute lock).
        $lock = Cache::lock('views:sync:lock', 120);

        if (! $lock->get()) {
            $this->line('Another sync is already running — skipping.');
            return self::SUCCESS;
        }

        try {
            $dirtyIds = Redis::smembers('view_dirty');

            if (empty($dirtyIds)) {
                return self::SUCCESS;
            }

            $rows = [];
            $now  = now();

            foreach ($dirtyIds as $rawId) {
                $postId = (int) $rawId;
                $key    = 'view_pending:' . $postId;

                $count = (int) Redis::get($key);
                if ($count < 1) {
                    // Nothing pending — clean up the dirty marker.
                    Redis::srem('view_dirty', $rawId);
                    continue;
                }

                // Atomically reduce the counter by the amount we're about to write.
                // Views that arrive between GET and DECRBY remain in the counter and
                // are picked up on the next cycle.
                $remaining = (int) Redis::decrby($key, $count);
                if ($remaining <= 0) {
                    Redis::srem('view_dirty', $rawId);
                }

                $rows[] = [
                    'post_id'    => $postId,
                    'view_count' => $count,
                    'viewed_at'  => $now,
                ];

                BlogPost::where('id', $postId)->increment('views', $count);
            }

            if (! empty($rows)) {
                BlogPostView::insert($rows);
                $this->info('Synced views for ' . count($rows) . ' post(s).');
            }

        } finally {
            $lock->release();
        }

        return self::SUCCESS;
    }
}
