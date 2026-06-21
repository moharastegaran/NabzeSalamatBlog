<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\PostMedia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class PostImagesSeeder extends Seeder
{
    private const W = 800;
    private const H = 500;
    private const IMAGES_PER_POST = 3;

    public function run(): void
    {
        BlogPost::all()->each(function (BlogPost $post) {
            $this->ensureFeaturedImage($post);
            $this->seedPostMediaImages($post);
        });
    }

    private function ensureFeaturedImage(BlogPost $post): void
    {
        $path = "blog-posts/{$post->slug}.jpg";

        $this->download(
            "https://picsum.photos/seed/{$post->slug}/" . self::W . '/' . self::H,
            $path
        );

        if (Storage::disk('public')->exists($path)) {
            $post->update(['featured_image' => $path]);
        }
    }

    private function seedPostMediaImages(BlogPost $post): void
    {
        $existing = $post->getMedia('image')->count();

        for ($i = $existing + 1; $i <= self::IMAGES_PER_POST; $i++) {
            $seed     = "{$post->slug}-img-{$i}";
            $fileName = "{$seed}.jpg";
            $path     = "post-media/image/{$post->id}/{$fileName}";

            $this->download(
                "https://picsum.photos/seed/{$seed}/" . self::W . '/' . self::H,
                $path
            );

            if (!Storage::disk('public')->exists($path)) {
                continue;
            }

            PostMedia::create([
                'model_type'        => BlogPost::class,
                'model_id'          => $post->id,
                'collection_name'   => 'image',
                'name'              => $seed,
                'file_name'         => $fileName,
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => 'image/jpeg',
                'size'              => Storage::disk('public')->size($path),
                'custom_properties' => [],
                'order_column'      => $i,
            ]);
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
        } catch (\Throwable) {
        }
    }
}
