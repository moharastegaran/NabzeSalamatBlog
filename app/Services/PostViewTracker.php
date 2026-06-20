<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class PostViewTracker
{
    /**
     * Record a view for the given post, with dedup and Redis write buffering.
     *
     * Dedup: same IP + UA + post is ignored for 30 minutes.
     * Write buffer: view count is incremented in Redis; a scheduled job
     * (views:sync) flushes it to MySQL every 5 minutes.
     */
    public function track(int $postId, Request $request): void
    {
        $hash     = md5($request->ip() . '|' . ($request->userAgent() ?? '') . '|' . $postId);
        $dedupKey = 'views.dedup.' . $hash;

        if (Cache::has($dedupKey)) {
            return;
        }

        Cache::put($dedupKey, true, now()->addMinutes(30));

        // Mark this post as having pending views and atomically increment the counter.
        Redis::sadd('view_dirty', (string) $postId);
        Redis::incr('view_pending:' . $postId);
    }
}
