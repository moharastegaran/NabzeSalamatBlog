<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;

class PostViewTracker
{
    /**
     * Record a view for the given post.
     *
     * Dedup: same IP + UA + post is ignored for 30 minutes.
     * Counter: incremented in Redis and flushed to BlogPost.views by views:sync.
     * Event:   full dimensional data pushed to Redis list view_events for
     *          per-row insertion into blog_post_views by views:sync.
     *
     * Returns the UUID token for this view session (used by the reading-time
     * beacon), or null when the request was deduped.
     */
    public function track(int $postId, Request $request): ?string
    {
        $hash     = md5($request->ip() . '|' . ($request->userAgent() ?? '') . '|' . $postId);
        $dedupKey = 'views.dedup.' . $hash;

        if (Cache::has($dedupKey)) {
            return null;
        }

        Cache::put($dedupKey, true, now()->addMinutes(30));

        $token = (string) Str::uuid();

        Redis::rpush('view_events', json_encode([
            'post_id'          => $postId,
            'token'            => $token,
            'referrer_domain'  => $this->parseReferrerDomain($request),
            'utm_source'       => $request->query('utm_source'),
            'utm_medium'       => $request->query('utm_medium'),
            'device_type'      => $this->detectDevice($request),
        ]));

        // Existing fast-counter path for BlogPost.views aggregate.
        Redis::sadd('view_dirty', (string) $postId);
        Redis::incr('view_pending:' . $postId);

        return $token;
    }

    private function parseReferrerDomain(Request $request): ?string
    {
        $referer = $request->headers->get('referer');
        if (! $referer) {
            return null;
        }

        $host = parse_url($referer, PHP_URL_HOST);
        if (! $host) {
            return null;
        }

        // Strip www. prefix so google.com and www.google.com collapse.
        return preg_replace('/^www\./i', '', strtolower($host));
    }

    private function detectDevice(Request $request): string
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent() ?? '');

        if ($agent->isMobile()) {
            return 'mobile';
        }

        if ($agent->isTablet()) {
            return 'tablet';
        }

        return 'desktop';
    }
}
