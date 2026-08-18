<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Http\Response;
use Throwable;

class SitemapController extends Controller
{
    public function index(): Response
    {
        return response($this->buildXml($this->collectUrls()), 200, $this->crawlerHeaders('application/xml; charset=UTF-8'));
    }

    /** Google-supported text sitemap (one URL per line) — useful if CDN/WAF mishandles .xml */
    public function text(): Response
    {
        $lines = array_map(
            static fn (array $url): string => $url['loc'],
            $this->collectUrls()
        );

        return response(implode("\n", $lines)."\n", 200, $this->crawlerHeaders('text/plain; charset=UTF-8'));
    }

    public function robots(): Response
    {
        $base = rtrim((string) config('app.url'), '/');

        $body = implode("\n", [
            'User-agent: *',
            'Allow: /',
            '',
            'Disallow: /dashboard',
            'Disallow: /blog-posts',
            'Disallow: /blog-categories',
            'Disallow: /blog-tags',
            'Disallow: /blog-analytics',
            'Disallow: /customer',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /profile',
            'Disallow: /assets',
            'Disallow: /tickets',
            'Disallow: /notes',
            'Disallow: /roles',
            'Disallow: /notifications',
            '',
            // Prefer text sitemap: robots.txt already fetches cleanly worldwide; .xml often 503s via CDN.
            "Sitemap: {$base}/sitemap.txt",
            "Sitemap: {$base}/sitemap.xml",
            '',
        ]);

        return response($body, 200, $this->crawlerHeaders('text/plain; charset=UTF-8'));
    }

    /** @return list<array{loc: string, lastmod?: string|null, changefreq?: string, priority?: string}> */
    private function collectUrls(): array
    {
        $base = rtrim((string) config('app.url'), '/');

        $urls = [
            ['loc' => $base.'/', 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => $base.'/blog', 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => $base.'/about-us', 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => $base.'/contact', 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => $base.'/health-timeline', 'changefreq' => 'weekly', 'priority' => '0.6'],
            ['loc' => $base.'/gallery', 'changefreq' => 'weekly', 'priority' => '0.5'],
        ];

        try {
            BlogPost::published()
                ->orderBy('id')
                ->select(['id', 'slug', 'updated_at', 'published_at'])
                ->chunkById(200, function ($posts) use (&$urls, $base) {
                    foreach ($posts as $post) {
                        if (! filled($post->slug)) {
                            continue;
                        }

                        $urls[] = [
                            'loc'        => $base.'/blog/'.$post->slug,
                            'lastmod'    => optional($post->updated_at ?? $post->published_at)?->format('Y-m-d'),
                            'changefreq' => 'weekly',
                            'priority'   => '0.8',
                        ];
                    }
                });

            foreach (BlogCategory::query()->orderBy('name')->get(['slug', 'updated_at']) as $category) {
                if (! filled($category->slug)) {
                    continue;
                }

                $urls[] = [
                    'loc'        => $base.'/blog/category/'.$category->slug,
                    'lastmod'    => optional($category->updated_at)?->format('Y-m-d'),
                    'changefreq' => 'weekly',
                    'priority'   => '0.7',
                ];
            }

            foreach (BlogTag::query()->orderBy('name')->get(['slug', 'updated_at']) as $tag) {
                if (! filled($tag->slug)) {
                    continue;
                }

                $urls[] = [
                    'loc'        => $base.'/blog/tag/'.$tag->slug,
                    'lastmod'    => optional($tag->updated_at)?->format('Y-m-d'),
                    'changefreq' => 'weekly',
                    'priority'   => '0.6',
                ];
            }
        } catch (Throwable $e) {
            report($e);
        }

        return $urls;
    }

    /** @return array<string, string> */
    private function crawlerHeaders(string $contentType): array
    {
        return [
            'Content-Type'           => $contentType,
            'Cache-Control'          => 'public, max-age=3600, s-maxage=3600',
            'X-Content-Type-Options' => 'nosniff',
        ];
    }

    /** @param  list<array{loc: string, lastmod?: string|null, changefreq?: string, priority?: string}>  $urls */
    private function buildXml(array $urls): string
    {
        $lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        foreach ($urls as $url) {
            $lines[] = '    <url>';
            $lines[] = '        <loc>'.$this->xml($url['loc']).'</loc>';

            if (! empty($url['lastmod'])) {
                $lines[] = '        <lastmod>'.$this->xml($url['lastmod']).'</lastmod>';
            }

            if (! empty($url['changefreq'])) {
                $lines[] = '        <changefreq>'.$this->xml($url['changefreq']).'</changefreq>';
            }

            if (! empty($url['priority'])) {
                $lines[] = '        <priority>'.$this->xml($url['priority']).'</priority>';
            }

            $lines[] = '    </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines)."\n";
    }

    private function xml(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
