<?php

namespace App\Services;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostBroadcastFormatter
{
    private const CAPTION_LIMIT = 4096;

    private const MAX_PARAGRAPHS = 2;

    private const MEDICAL_SEPARATOR = '🧬🧠🫁🫀🦷🦿🩻🔬🌡️🩸💉💊';

    public function format(BlogPost $post, int $limit = self::CAPTION_LIMIT): string
    {
        $contentLines = ['📍'.$this->escapeMarkdown($post->title)];

        foreach ($this->extractParagraphs($post) as $index => $paragraph) {
            $contentLines[] = '';
            $contentLines[] = ($index % 2 === 0 ? '🔸' : '').$this->escapeMarkdown($paragraph);
        }

        $footerBlock = array_merge([''], $this->footerLines($post));

        while ($contentLines !== []
            && strlen(implode("\n", array_merge($contentLines, $footerBlock))) > $limit) {
            if (count($contentLines) <= 1) {
                break;
            }

            array_pop($contentLines);

            if ($contentLines !== [] && end($contentLines) === '') {
                array_pop($contentLines);
            }
        }

        return implode("\n", array_merge($contentLines, $footerBlock));
    }

    public function resolveFeaturedImagePath(BlogPost $post): ?string
    {
        if (! filled($post->featured_image)) {
            return null;
        }

        if (Str::startsWith($post->featured_image, ['http://', 'https://'])) {
            return null;
        }

        $localPath = storage_path('app/public/'.ltrim($post->featured_image, '/'));

        return is_file($localPath) ? $localPath : null;
    }

    public function resolveFeaturedImageUrl(BlogPost $post): ?string
    {
        if (! filled($post->featured_image)) {
            return null;
        }

        if (Str::startsWith($post->featured_image, ['http://', 'https://'])) {
            return $post->featured_image;
        }

        $relativePath = ltrim($post->featured_image, '/');
        $localPath    = storage_path('app/public/'.$relativePath);

        if (is_file($localPath)) {
            return Storage::disk('public')->url($relativePath);
        }

        return Storage::disk('public')->url($relativePath);
    }

    /** @return list<string> */
    private function extractParagraphs(BlogPost $post): array
    {
        $paragraphs = $this->collectParagraphs($post);

        return array_slice($paragraphs, 0, self::MAX_PARAGRAPHS);
    }

    /** @return list<string> */
    private function collectParagraphs(BlogPost $post): array
    {
        $html = $post->body ?? '';

        if (filled($html) && preg_match_all('/<p[^>]*>(.*?)<\/p>/is', $html, $matches)) {
            $paragraphs = [];

            foreach ($matches[1] as $content) {
                $text = $this->normalizeText($content);

                if ($text !== '') {
                    $paragraphs[] = $text;
                }
            }

            if ($paragraphs !== []) {
                return $paragraphs;
            }
        }

        if (filled($html)) {
            $plain = $this->normalizeText($html);

            if ($plain !== '') {
                $parts = preg_split('/\n\s*\n/u', $plain) ?: [];
                $parts = array_values(array_filter(array_map('trim', $parts)));

                if ($parts !== []) {
                    return $parts;
                }

                return [$plain];
            }
        }

        if (filled($post->excerpt)) {
            return [trim($post->excerpt)];
        }

        return [];
    }

    private function normalizeText(string $html): string
    {
        $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return trim(preg_replace('/\s+/u', ' ', $text) ?? '');
    }

    /** @return list<string> */
    private function footerLines(BlogPost $post): array
    {
        $lines = [];

        $shortUrl = $this->shortPostUrl($post);

        if (filled($shortUrl)) {
            $lines[] = '📶 '.$this->markdownLink('مشاهده متن کامل خبر', $shortUrl);
        }

        $lines[] = self::MEDICAL_SEPARATOR;
        $lines[] = '📡 با '.config('app.name', 'نبض سلامت').' همراه باشید';

        $socialLinks = array_filter([
            $this->socialMarkdownLink('بله', (string) config('services.social.bale')),
            $this->socialMarkdownLink('واتساپ', (string) config('services.social.whatsapp')),
            $this->socialMarkdownLink('تلگرام', (string) config('services.social.telegram')),
        ]);

        if ($socialLinks !== []) {
            $lines[] = implode(' | ', $socialLinks);
        }

        return $lines;
    }

    private function shortPostUrl(BlogPost $post): ?string
    {
        if (! filled($post->short_link)) {
            return null;
        }

        return url('/'.$post->short_link);
    }

    private function socialMarkdownLink(string $label, string $url): ?string
    {
        if (! filled($url)) {
            return null;
        }

        return $this->markdownLink($label, $url);
    }

    private function markdownLink(string $label, string $url): string
    {
        return '['.$this->escapeMarkdown($label).']('.$url.')';
    }

    private function escapeMarkdown(string $text): string
    {
        return str_replace(
            ['\\', '_', '*', '[', ']', '`'],
            ['\\\\', '\\_', '\\*', '\\[', '\\]', '\\`'],
            $text,
        );
    }
}
