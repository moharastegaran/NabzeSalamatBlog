<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class BlogCategoryIconSeeder extends Seeder
{
    private array $icons = [

        'nbd-tv' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F24F00">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2H6v2h12v-2h-2v-2h5c1.1 0 2-.9
                2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
        </svg>',

        'nbd-thlyl' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F24F00">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z
                M7 19H5V5h2v14zm4 0H9V9h2v10zm4 0h-2v-6h2v6zm4 0h-2V7h2v12z"/>
        </svg>',

        'nbd-khbr' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F24F00">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z
                m-8 2.5h7.5V9H12V6.5zm0 3.5h7.5v2H12v-2zm0 3.5h7.5V16H12v-2.5zM4 16V8h6.5v8H4z"/>
        </svg>',

        'nbd-dansh' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F24F00">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>',

        'nbd-sda' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F24F00">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6
                c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5
                c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
        </svg>',

        'nbd-kanon' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F24F00">
            <path d="M1 21h12v2H1z"/>
            <path d="M5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828z"/>
            <path d="M12.317 1l5.657 5.656-2.83 2.83-5.656-5.66z"/>
            <path d="M3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z"/>
        </svg>',

    ];

    public function run(): void
    {
        Storage::disk('public')->makeDirectory('blog-categories/icons');

        foreach ($this->icons as $slug => $svg) {
            $path = "blog-categories/icons/{$slug}.svg";
            Storage::disk('public')->put($path, trim($svg));
            BlogCategory::where('slug', $slug)->update(['icon' => $path]);
            $this->command->info("Icon set for [{$slug}].");
        }
    }
}
