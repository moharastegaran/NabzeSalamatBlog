<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $base = rtrim(config('app.url'), '/');

        $urls = [
            ['loc' => $base.'/', 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => $base.'/blog', 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => $base.'/about-us', 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => $base.'/contact', 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => $base.'/health-timeline', 'changefreq' => 'weekly', 'priority' => '0.6'],
            ['loc' => $base.'/gallery', 'changefreq' => 'weekly', 'priority' => '0.5'],
        ];

        foreach (BlogPost::published()->latest('published_at')->get(['slug', 'updated_at', 'published_at']) as $post) {
            $urls[] = [
                'loc'        => $base.'/blog/'.$post->slug,
                'lastmod'    => optional($post->updated_at ?? $post->published_at)?->toAtomString(),
                'changefreq' => 'weekly',
                'priority'   => '0.8',
            ];
        }

        foreach (BlogCategory::orderBy('name')->get(['slug', 'updated_at']) as $category) {
            $urls[] = [
                'loc'        => $base.'/blog/category/'.$category->slug,
                'lastmod'    => optional($category->updated_at)?->toAtomString(),
                'changefreq' => 'weekly',
                'priority'   => '0.7',
            ];
        }

        foreach (BlogTag::orderBy('name')->get(['slug', 'updated_at']) as $tag) {
            $urls[] = [
                'loc'        => $base.'/blog/tag/'.$tag->slug,
                'lastmod'    => optional($tag->updated_at)?->toAtomString(),
                'changefreq' => 'weekly',
                'priority'   => '0.6',
            ];
        }

        $xml = $this->buildXml($urls);

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function robots(): Response
    {
        $sitemap = rtrim(config('app.url'), '/').'/sitemap.xml';

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
            "Sitemap: {$sitemap}",
            '',
        ]);

        return response($body, 200)->header('Content-Type', 'text/plain; charset=UTF-8');
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
            $lines[] = '        <loc>'.e($url['loc']).'</loc>';

            if (! empty($url['lastmod'])) {
                $lines[] = '        <lastmod>'.e($url['lastmod']).'</lastmod>';
            }

            if (! empty($url['changefreq'])) {
                $lines[] = '        <changefreq>'.e($url['changefreq']).'</changefreq>';
            }

            if (! empty($url['priority'])) {
                $lines[] = '        <priority>'.e($url['priority']).'</priority>';
            }

            $lines[] = '    </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines)."\n";
    }
}
