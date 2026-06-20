<?php

namespace App\Services;

use App\Models\BlogPostView;
use Illuminate\Support\Facades\Cache;

class BlogAnalyticsService
{
    private const TTL = 600; // 10 minutes

    public function all(int $days): array
    {
        return [
            'summary'         => $this->summary($days),
            'views_over_time' => $this->viewsOverTime($days),
            'device_split'    => $this->deviceSplit($days),
            'top_referrers'   => $this->topReferrers($days),
            'utm_sources'     => $this->utmSources($days),
            'top_posts'       => $this->topPosts($days),
        ];
    }

    public function summary(int $days): array
    {
        return Cache::remember("analytics.summary.{$days}", self::TTL, function () use ($days) {
            $since = now()->subDays($days);

            $base = BlogPostView::where('viewed_at', '>=', $since);

            $totalViews      = (int) (clone $base)->sum('view_count');
            $uniquePosts     = (int) (clone $base)->distinct('post_id')->count('post_id');
            $avgReadSeconds  = (int) round((clone $base)->whereNotNull('reading_seconds')->avg('reading_seconds') ?? 0);
            $topSource       = (clone $base)
                ->selectRaw('referrer_domain, SUM(view_count) as views')
                ->whereNotNull('referrer_domain')
                ->groupBy('referrer_domain')
                ->orderByDesc('views')
                ->value('referrer_domain');

            return compact('totalViews', 'uniquePosts', 'avgReadSeconds', 'topSource');
        });
    }

    /** Daily view totals for the last N days, zero-filled for days with no data. */
    public function viewsOverTime(int $days): array
    {
        return Cache::remember("analytics.views_over_time.{$days}", self::TTL, function () use ($days) {
            $raw = BlogPostView::selectRaw('DATE(viewed_at) as date, SUM(view_count) as views')
                ->where('viewed_at', '>=', now()->subDays($days))
                ->groupBy('date')
                ->orderBy('date')
                ->pluck('views', 'date')
                ->map(fn ($v) => (int) $v);

            $series = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $date      = now()->subDays($i)->format('Y-m-d');
                $series[]  = ['date' => $date, 'views' => $raw[$date] ?? 0];
            }

            return $series;
        });
    }

    public function deviceSplit(int $days): array
    {
        return Cache::remember("analytics.device_split.{$days}", self::TTL, function () use ($days) {
            return BlogPostView::selectRaw('device_type, SUM(view_count) as views')
                ->whereNotNull('device_type')
                ->where('viewed_at', '>=', now()->subDays($days))
                ->groupBy('device_type')
                ->orderByDesc('views')
                ->get(['device_type', 'views'])
                ->map(fn ($r) => ['device_type' => $r->device_type, 'views' => (int) $r->views])
                ->toArray();
        });
    }

    public function topReferrers(int $days): array
    {
        return Cache::remember("analytics.top_referrers.{$days}", self::TTL, function () use ($days) {
            return BlogPostView::selectRaw('referrer_domain, SUM(view_count) as views')
                ->whereNotNull('referrer_domain')
                ->where('viewed_at', '>=', now()->subDays($days))
                ->groupBy('referrer_domain')
                ->orderByDesc('views')
                ->limit(10)
                ->get(['referrer_domain', 'views'])
                ->map(fn ($r) => ['referrer_domain' => $r->referrer_domain, 'views' => (int) $r->views])
                ->toArray();
        });
    }

    public function utmSources(int $days): array
    {
        return Cache::remember("analytics.utm_sources.{$days}", self::TTL, function () use ($days) {
            return BlogPostView::selectRaw('utm_source, utm_medium, SUM(view_count) as views')
                ->whereNotNull('utm_source')
                ->where('viewed_at', '>=', now()->subDays($days))
                ->groupBy('utm_source', 'utm_medium')
                ->orderByDesc('views')
                ->limit(10)
                ->get()
                ->map(fn ($r) => [
                    'utm_source' => $r->utm_source,
                    'utm_medium' => $r->utm_medium,
                    'views'      => (int) $r->views,
                ])
                ->toArray();
        });
    }

    /** Top posts by view count for the last N days, with avg reading time. */
    public function topPosts(int $days): array
    {
        return Cache::remember("analytics.top_posts.{$days}", self::TTL, function () use ($days) {
            return BlogPostView::join('blog_posts', 'blog_post_views.post_id', '=', 'blog_posts.id')
                ->selectRaw('
                    blog_post_views.post_id,
                    blog_posts.title,
                    blog_posts.slug,
                    SUM(blog_post_views.view_count)            AS views,
                    ROUND(AVG(blog_post_views.reading_seconds)) AS avg_reading_seconds
                ')
                ->where('blog_post_views.viewed_at', '>=', now()->subDays($days))
                ->groupBy('blog_post_views.post_id', 'blog_posts.title', 'blog_posts.slug')
                ->orderByDesc('views')
                ->limit(10)
                ->get()
                ->map(fn ($r) => [
                    'post_id'             => $r->post_id,
                    'title'               => $r->title,
                    'slug'                => $r->slug,
                    'views'               => (int) $r->views,
                    'avg_reading_seconds' => $r->avg_reading_seconds !== null ? (int) $r->avg_reading_seconds : null,
                ])
                ->toArray();
        });
    }
}
