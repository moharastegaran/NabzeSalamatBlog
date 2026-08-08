<?php

use App\Models\PageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        PageContent::query()->updateOrCreate(
            ['slug' => 'footer-quick-links'],
            [
                'title'   => PageContent::defaultTitle('footer-quick-links'),
                'content' => PageContent::footerQuickLinksDefaults(),
            ],
        );
    }

    public function down(): void
    {
        PageContent::query()->where('slug', 'footer-quick-links')->delete();
    }
};
