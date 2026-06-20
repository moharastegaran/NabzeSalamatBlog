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
    protected $description = 'Flush buffered view counts and events from Redis to MySQL';

    public function handle(): int
    {
        $lock = Cache::lock('views:sync:lock', 120);

        if (! $lock->get()) {
            $this->line('Another sync is already running — skipping.');
            return self::SUCCESS;
        }

        try {
            $this->syncCounters();
            $this->syncEvents();
        } finally {
            $lock->release();
        }

        return self::SUCCESS;
    }

    /** Flush aggregated view_pending counters → BlogPost.views column. */
    private function syncCounters(): void
    {
        $dirtyIds = Redis::smembers('view_dirty');

        if (empty($dirtyIds)) {
            return;
        }

        foreach ($dirtyIds as $rawId) {
            $postId = (int) $rawId;
            $key    = 'view_pending:' . $postId;

            $count = (int) Redis::get($key);
            if ($count < 1) {
                Redis::srem('view_dirty', $rawId);
                continue;
            }

            $remaining = (int) Redis::decrby($key, $count);
            if ($remaining <= 0) {
                Redis::srem('view_dirty', $rawId);
            }

            BlogPost::where('id', $postId)->increment('views', $count);
        }
    }

    /**
     * Drain the view_events list and insert individual rows into blog_post_views.
     * For each event, reading_seconds is resolved from Redis if the beacon has
     * already arrived; otherwise the column stays null (updated later by the
     * reading-time endpoint).
     */
    private function syncEvents(): void
    {
        // Atomically move all current events to a temp list so new events
        // arriving during this sync cycle are not lost.
        $raw = Redis::lrange('view_events', 0, -1);

        if (empty($raw)) {
            return;
        }

        Redis::ltrim('view_events', count($raw), -1);

        $now  = now();
        $rows = [];

        foreach ($raw as $json) {
            $event = json_decode($json, true);
            if (! isset($event['post_id'], $event['token'])) {
                continue;
            }

            $token          = $event['token'];
            $readingSeconds = $this->popReadingTime($token);

            $rows[] = [
                'post_id'         => (int) $event['post_id'],
                'token'           => $token,
                'view_count'      => 1,
                'referrer_domain' => $event['referrer_domain'] ?? null,
                'utm_source'      => $event['utm_source']      ?? null,
                'utm_medium'      => $event['utm_medium']       ?? null,
                'device_type'     => $event['device_type']     ?? null,
                'reading_seconds' => $readingSeconds,
                'viewed_at'       => $now,
            ];
        }

        if (! empty($rows)) {
            BlogPostView::insert($rows);
            $this->info('Synced ' . count($rows) . ' view event(s).');
        }
    }

    /** Retrieve and delete a pending reading time stored by the beacon endpoint. */
    private function popReadingTime(string $token): ?int
    {
        $key     = 'reading_time:' . $token;
        $seconds = Redis::get($key);

        if ($seconds !== null) {
            Redis::del($key);
            return (int) $seconds;
        }

        return null;
    }
}
