<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class BlogCategoryMediaSeeder extends Seeder
{
    private const THUMB_W = 800;
    private const THUMB_H = 500;
    private const ICON_W  = 120;
    private const ICON_H  = 120;

    private array $map = [
        'nbd-khbr'  => ['thumb' => 'newspaper-press',  'icon' => 'news-broadcast'],
        'nbd-sda'   => ['thumb' => 'microphone-radio',  'icon' => 'audio-wave'],
        'nbd-kanon' => ['thumb' => 'justice-courthouse', 'icon' => 'law-book'],
        'nbd-dansh' => ['thumb' => 'books-library',     'icon' => 'education-lamp'],
        'nbd-tv'    => ['thumb' => 'television-studio',  'icon' => 'camera-video'],
        'nbd-thlyl' => ['thumb' => 'charts-analytics',  'icon' => 'analysis-graph'],
    ];

    public function run(): void
    {
        Storage::disk('public')->makeDirectory('blog-categories');
        Storage::disk('public')->makeDirectory('blog-categories/icons');

        foreach ($this->map as $slug => $seeds) {
            $cat = BlogCategory::where('slug', $slug)->first();
            if (! $cat) {
                $this->command->warn("Category [{$slug}] not found — skipping.");
                continue;
            }

            $thumbPath = "blog-categories/{$slug}.jpg";
            $iconPath  = "blog-categories/icons/{$slug}.jpg";

            $this->download(
                "https://picsum.photos/seed/{$seeds['thumb']}/" . self::THUMB_W . '/' . self::THUMB_H,
                $thumbPath
            );
            $this->download(
                "https://picsum.photos/seed/{$seeds['icon']}/" . self::ICON_W . '/' . self::ICON_H,
                $iconPath
            );

            $cat->update([
                'thumbnail' => Storage::disk('public')->exists($thumbPath) ? $thumbPath : null,
                'icon'      => Storage::disk('public')->exists($iconPath)  ? $iconPath  : null,
            ]);

            $this->command->info("Updated [{$slug}].");
        }
    }

    private function download(string $url, string $storagePath): void
    {
        if (Storage::disk('public')->exists($storagePath)) {
            return;
        }

        try {
            $response = Http::timeout(20)->get($url);
            if ($response->successful()) {
                Storage::disk('public')->put($storagePath, $response->body());
            }
        } catch (\Throwable $e) {
            $this->command->warn("Failed to download {$url}: {$e->getMessage()}");
        }
    }
}
