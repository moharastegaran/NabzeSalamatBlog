<?php

namespace App\Services;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostBroadcastFormatter
{
    private const CAPTION_LIMIT = 4096;

    private const FOOTER_SEPARATOR = '┄┅═✧❀❀✧═┅┄                                                                                                                                                                                        ╭━➖➖━⊰🍏⊱━➖➖➖➖➖━╮';

    private const FOOTER_CLOSER = '╰━━➖➖⊰🍏⊱➖➖➖➖➖━━╯';

    public function format(BlogPost $post, int $limit = self::CAPTION_LIMIT): string
    {
        $contentLines = ['📍'.$post->title];

        foreach ($this->extractParagraphs($post) as $index => $paragraph) {
            $contentLines[] = '';
            $contentLines[] = ($index % 2 === 0 ? '🔸' : '').$paragraph;
        }

        $footerBlock = array_merge([''], $this->footerLines());

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
    private function footerLines(): array
    {
        return [
            self::FOOTER_SEPARATOR,
            '🔗🆔همراه ما باشید👇🏻',
            config('services.bale.footer_bale_channel', 'کانال بله رسانه خبری نبض سلامت'),
            config('services.telegram.footer_channel', 'کانال تلگرام رسانه خبری نبض سلامت'),
            self::FOOTER_CLOSER,
        ];
    }
}
